import { NextResponse } from 'next/server'
import { apiRequest } from '@/lib/pasarguard'

export const dynamic = 'force-dynamic'

const PASARGUARD_URL = (process.env.PASARGUARD_API_URL || 'https://panel.example.com').replace(/\/$/, '')

async function apiGet(path: string) {
    return apiRequest(path, { signal: AbortSignal.timeout(5000) })
}

export async function GET() {
    try {
        if (PASARGUARD_URL.includes('example.com')) {
            return NextResponse.json({
                nodes: [{ name: 'Mock Node', address: '0.0.0.0', status: 'connected', ping: 0 }],
                protocols: ['VLESS'],
                system: { onlineUsers: 0, activeUsers: 0, cpuUsage: 0, memUsedPercent: 0 }
            })
        }

        // Fetch all 3 endpoints in parallel
        const [nodesRes, inboundsRes, systemRes] = await Promise.allSettled([
            apiGet('/api/nodes'),
            apiGet('/api/inbounds'),
            apiGet('/api/system')
        ])

        // Parse nodes
        let nodes: { name: string, address: string, port: number, status: string, message: string, ping: number, connectionType: string, xrayVersion: string, nodeVersion: string, uplinkGB: number, downlinkGB: number }[] = []
        if (nodesRes.status === 'fulfilled' && nodesRes.value.ok) {
            const data = await nodesRes.value.json()
            const nodeList = Array.isArray(data) ? data : (data.nodes || [])

            nodes = nodeList.map((n: { name?: string, address?: string, port?: number, status?: string, message?: string, connection_type?: string, xray_version?: string, node_version?: string, uplink?: number, downlink?: number }) => ({
                name: n.name || 'Unknown',
                address: n.address || '0.0.0.0',
                port: n.port || 0,
                status: n.status || 'connected',
                message: n.message || '',
                ping: n.status === 'connected' ? Math.floor(Math.random() * (120 - 20 + 1) + 20) : -1, // Dummy ping for now since Vercel Edge blocks raw TCP sockets
                connectionType: n.connection_type || 'unknown',
                xrayVersion: n.xray_version || '',
                nodeVersion: n.node_version || '',
                uplinkGB: Math.round((n.uplink || 0) / (1024 * 1024 * 1024) * 100) / 100,
                downlinkGB: Math.round((n.downlink || 0) / (1024 * 1024 * 1024) * 100) / 100,
            }))
        }

        // Parse protocols (inbounds)
        let protocols: string[] = []
        if (inboundsRes.status === 'fulfilled' && inboundsRes.value.ok) {
            const data = await inboundsRes.value.json()
            // API returns an array of strings like ["VLESS"]
            protocols = Array.isArray(data) ? data : Object.keys(data)
        }

        // Parse system stats
        let system = {
            onlineUsers: 0,
            activeUsers: 0,
            totalUsers: 0,
            cpuUsage: 0,
            memUsedPercent: 0,
            incomingBandwidthGB: 0,
            outgoingBandwidthGB: 0,
            version: ''
        }
        if (systemRes.status === 'fulfilled' && systemRes.value.ok) {
            const data = await systemRes.value.json()
            system = {
                onlineUsers: data.online_users || 0,
                activeUsers: data.active_users || 0,
                totalUsers: data.total_user || 0,
                cpuUsage: Math.round((data.cpu_usage || 0) * 10) / 10,
                memUsedPercent: data.mem_total ? Math.round((data.mem_used / data.mem_total) * 100) : 0,
                incomingBandwidthGB: Math.round((data.incoming_bandwidth || 0) / (1024 * 1024 * 1024) * 100) / 100,
                outgoingBandwidthGB: Math.round((data.outgoing_bandwidth || 0) / (1024 * 1024 * 1024) * 100) / 100,
                version: data.version || ''
            }
        }

        let debugInfo: Record<string, unknown> | null = null;
        if (nodes.length === 0) {
            debugInfo = {
                url: PASARGUARD_URL,
                nodesStatus: nodesRes.status,
                inboundsStatus: inboundsRes.status,
                systemStatus: systemRes.status,
                nodesRejection: nodesRes.status === 'rejected' ? String(nodesRes.reason) : null,
                nodesOk: nodesRes.status === 'fulfilled' ? nodesRes.value.ok : false,
                nodesHttpStatus: nodesRes.status === 'fulfilled' ? nodesRes.value.status : null,
            };
            if (nodesRes.status === 'fulfilled' && !nodesRes.value.ok) {
                try {
                    debugInfo.nodesText = await nodesRes.value.text();
                } catch {
                    // Ignore text parsing errors
                }
            }
        }

        return NextResponse.json({ nodes, protocols, system, debugInfo })
    } catch (error) {
        console.error('Server status error:', error)
        return NextResponse.json({ error: 'Failed to fetch server status' }, { status: 500 })
    }
}
