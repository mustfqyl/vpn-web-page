/**
 * PasarGuard Panel API Service
 * 
 * Connects to a PasarGuard Panel (FastAPI-based, Marzban-like) REST API
 * for user provisioning, traffic stats, and subscription management.
 */

const PASARGUARD_URL = (process.env.PASARGUARD_API_URL || 'https://panel.example.com').replace(/\/$/, '')
const USERNAME = process.env.PASARGUARD_ADMIN_USERNAME || 'admin'
const PASSWORD = process.env.PASARGUARD_ADMIN_PASSWORD || 'password'

let cachedToken: string | null = null
let tokenExpiry: number = 0

/**
 * Authenticate with PasarGuard Panel admin API and cache the token.
 * POST /api/admin/token  (form-encoded: username, password, grant_type=password)
 */
async function getAdminToken(): Promise<string> {
    if (cachedToken && Date.now() < tokenExpiry) {
        return cachedToken
    }

    try {
        // Mock Login for development if URL is example.com
        if (PASARGUARD_URL.includes('example.com')) {
            cachedToken = 'mock_token'
            tokenExpiry = Date.now() + 3600 * 1000
            return cachedToken
        }

        const formData = new URLSearchParams()
        formData.append('username', USERNAME)
        formData.append('password', PASSWORD)
        formData.append('grant_type', 'password')

        const res = await fetch(`${PASARGUARD_URL}/api/admin/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
        })

        if (!res.ok) {
            const errText = await res.text()
            throw new Error(`PasarGuard login failed (${res.status}): ${errText}`)
        }

        const data = await res.json()
        cachedToken = data.access_token
        // Token typically lasts ~24h, refresh every 12h
        tokenExpiry = Date.now() + 12 * 3600 * 1000

        return cachedToken!
    } catch (error) {
        console.error('PasarGuard Login Error:', error)
        throw error
    }
}

/**
 * Helper to make authenticated requests to PasarGuard Panel API
 */
export async function apiRequest(path: string, options: RequestInit = {}): Promise<Response> {
    const token = await getAdminToken()

    const res = await fetch(`${PASARGUARD_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...(options.headers || {})
        }
    })

    // If 401, clear token cache and retry once
    if (res.status === 401 && cachedToken) {
        cachedToken = null
        tokenExpiry = 0
        const retryToken = await getAdminToken()
        return fetch(`${PASARGUARD_URL}${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${retryToken}`,
                ...(options.headers || {})
            }
        })
    }

    return res
}

// ----- Data Types -----

export interface PasarGuardUser {
    username: string
    status: 'active' | 'disabled' | 'limited' | 'expired' | 'on_hold'
    used_traffic: number       // bytes
    data_limit: number | null  // bytes, null = unlimited
    expire: number | null      // unix timestamp, null = never
    online_at: string | null   // ISO datetime
    sub_url: string            // subscription link
    subscription_url: string   // full subscription URL
    links: string[]
    note: string
    on_hold_expire_duration: number | null
    on_hold_timeout: string | null
    created_at: string
}

export interface PasarGuardCreateUserPayload {
    username: string
    proxy_settings?: Record<string, Record<string, unknown>>
    inbounds?: Record<string, string[]>
    expire?: number | null         // unix timestamp
    data_limit?: number | null     // bytes
    data_limit_reset_strategy?: string
    status?: string
    note?: string
    group_ids?: number[]
}

/**
 * Resolve a group name (e.g. 'trial', 'user', 'VIP') to its numeric ID
 * via GET /api/groups
 */
async function resolveGroupId(name: string): Promise<number | null> {
    try {
        const res = await apiRequest('/api/groups')
        if (!res.ok) return null
        const data = await res.json()
        const groups = data.groups || []
        const match = groups.find((g: { id: number; name: string }) => g.name.toLowerCase() === name.toLowerCase())
        return match ? match.id : null
    } catch {
        return null
    }
}

// ----- Service Methods -----

export const pasarguardService = {

    /**
     * Create a new user in PasarGuard Panel.
     * POST /api/user
     */
    async createUser(email: string, options?: {
        expireDays?: number
        dataLimitGB?: number
        group?: string
    }): Promise<{ username: string; subscription_url: string }> {

        // Mock for development
        if (PASARGUARD_URL.includes('example.com')) {
            return {
                username: email,
                subscription_url: `${PASARGUARD_URL}/sub/mock_${Date.now()}`
            }
        }

        const payload: PasarGuardCreateUserPayload = {
            username: email,
            proxy_settings: {
                vless: {
                    id: crypto.randomUUID(),
                    flow: 'xtls-rprx-vision'
                },
                vmess: { id: crypto.randomUUID() },
                trojan: { password: crypto.randomUUID() }
            },
            inbounds: {},
            status: 'active',
            note: `User: ${email} | Created At: ${new Date().toISOString()}`,
        }

        // Set expiry if provided
        if (options?.expireDays) {
            payload.expire = Math.floor(Date.now() / 1000) + (options.expireDays * 86400)
        }

        // Set data limit if provided (GB → bytes)
        if (options?.dataLimitGB) {
            payload.data_limit = options.dataLimitGB * 1024 * 1024 * 1024
        }

        // Resolve group name to numeric ID via API
        if (options?.group) {
            const groupId = await resolveGroupId(options.group)
            if (groupId !== null) {
                payload.group_ids = [groupId]
            } else {
                console.warn(`PasarGuard: Group '${options.group}' not found, skipping group assignment`)
            }
        }

        const res = await apiRequest('/api/user', {
            method: 'POST',
            body: JSON.stringify(payload)
        })

        if (!res.ok) {
            // If 409 conflict (user already exists), try to get existing user
            if (res.status === 409) {
                const existingUser = await this.getUser(email)
                if (existingUser) {
                    return {
                        username: existingUser.username,
                        subscription_url: existingUser.subscription_url || existingUser.sub_url
                    }
                }
            }
            const err = await res.text()
            console.error('PasarGuard Create User Error:', err)
            throw new Error(`Failed to create user in PasarGuard: ${err}`)
        }

        const data = await res.json()
        let subUrl = data.subscription_url || data.sub_url || ''
        if (subUrl.startsWith('/sub/')) {
            subUrl = `${PASARGUARD_URL}${subUrl}`
        }
        return {
            username: data.username,
            subscription_url: subUrl
        }
    },

    /**
     * Get user details from PasarGuard Panel.
     * GET /api/user/{username}
     */
    async getUser(username: string): Promise<PasarGuardUser | null> {
        // Mock for development
        if (PASARGUARD_URL.includes('example.com')) {
            return {
                username,
                status: 'active',
                used_traffic: 5 * 1024 * 1024 * 1024, // 5 GB
                data_limit: 100 * 1024 * 1024 * 1024,  // 100 GB
                expire: Math.floor(Date.now() / 1000) + 30 * 86400, // 30 days
                online_at: new Date().toISOString(),
                sub_url: `${PASARGUARD_URL}/sub/mock_sub`,
                subscription_url: `${PASARGUARD_URL}/sub/mock_sub`,
                links: [],
                note: '',
                on_hold_expire_duration: null,
                on_hold_timeout: null,
                created_at: new Date().toISOString()
            }
        }

        try {
            const res = await apiRequest(`/api/user/${encodeURIComponent(username)}`)

            if (!res.ok) {
                if (res.status === 404) return null
                throw new Error(`Failed to get user (${res.status})`)
            }

            const data = await res.json()
            if (data.subscription_url && data.subscription_url.startsWith('/sub/')) {
                data.subscription_url = `${PASARGUARD_URL}${data.subscription_url}`
            }
            if (data.sub_url && data.sub_url.startsWith('/sub/')) {
                data.sub_url = `${PASARGUARD_URL}${data.sub_url}`
            }
            return data
        } catch (error) {
            console.error('PasarGuard Get User Error:', error)
            throw error // Throw instead of returning null to prevent false deletions
        }
    },

    /**
     * Delete user from PasarGuard Panel.
     * DELETE /api/user/{username}
     */
    async deleteUser(username: string): Promise<boolean> {
        if (PASARGUARD_URL.includes('example.com')) return true

        try {
            const res = await apiRequest(`/api/user/${encodeURIComponent(username)}`, {
                method: 'DELETE'
            })

            return res.ok
        } catch (error) {
            console.error('PasarGuard Delete User Error:', error)
            return false
        }
    },

    /**
     * Update user in PasarGuard Panel.
     * PUT /api/user/{username}
     */
    async updateUser(username: string, data: Partial<PasarGuardCreateUserPayload>): Promise<boolean> {
        if (PASARGUARD_URL.includes('example.com')) return true

        try {
            const res = await apiRequest(`/api/user/${encodeURIComponent(username)}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            })

            return res.ok
        } catch (error) {
            console.error('PasarGuard Update User Error:', error)
            return false
        }
    },

    /**
     * Fetch subscription content from a PasarGuard sub URL.
     * This is the raw config text (vmess://, vless://, etc.)
     */
    async getSubscriptionContent(subUrl: string): Promise<string> {
        // Mock for development
        if (subUrl.includes('example.com')) {
            return `# Mock Subscription Content
vless://mock-uuid@server.example.com:443?security=tls#SecureVPN
vmess://eyJhZGQiOiJzZXJ2ZXIuZXhhbXBsZS5jb20ifQ==`
        }

        try {
            const res = await fetch(subUrl, {
                headers: {
                    'User-Agent': 'SecureVPN/1.0'
                }
            })
            if (!res.ok) throw new Error(`Failed to fetch subscription (${res.status})`)
            return await res.text()
        } catch (error) {
            console.error('PasarGuard Fetch Sub Error:', error)
            throw error
        }
    },

    /**
     * Reset user traffic stats.
     * POST /api/user/{username}/reset
     */
    async resetUserTraffic(username: string): Promise<boolean> {
        if (PASARGUARD_URL.includes('example.com')) return true

        try {
            const res = await apiRequest(`/api/user/${encodeURIComponent(username)}/reset`, {
                method: 'POST'
            })
            return res.ok
        } catch (error) {
            console.error('PasarGuard Reset Traffic Error:', error)
            return false
        }
    }
}
