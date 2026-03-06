// Type definitions for the customer portal

export interface Customer {
    id: string;
    email: string;
    password_hash: string;
    name: string | null;
    vpn_username: string | null;
    created_at: string;
    updated_at: string;
}

export interface Plan {
    id: string;
    name: string;
    price_eur: number;
    duration_days: number;
    bandwidth_gb: number;
    max_clients: number;
    is_active: boolean;
    created_at: string;
}

export interface Subscription {
    id: string;
    customer_id: string;
    plan_id: string;
    status: 'pending' | 'active' | 'expired' | 'cancelled';
    start_date: string | null;
    end_date: string | null;
    created_at: string;
}

export interface Payment {
    id: string;
    customer_id: string;
    subscription_id: string | null;
    amount: number;
    currency: string;
    provider: 'stripe' | 'paypal' | 'crypto';
    provider_tx_id: string | null;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    created_at: string;
}

export interface Session {
    id: string;
    customer_id: string;
    expires_at: string;
    created_at: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}

// Dashboard types
export interface DashboardData {
    subscription: Subscription | null;
    plan: Plan | null;
    usage: {
        usedGB: number;
        limitGB: number;
        remainingGB: number;
        usagePercent: number;
    };
    daysRemaining: number;
    subscriptionUrl: string | null;
}

// Auth types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name?: string;
}

export interface AuthResponse {
    success: boolean;
    token?: string;
    customer?: Omit<Customer, 'password_hash'>;
    error?: string;
}
