import { SupabaseService } from '../supabase/supabase.service';
export declare class AuthService {
    private readonly supabase;
    constructor(supabase: SupabaseService);
    register(dto: {
        email: string;
        password: string;
        name: string;
        companyName?: string;
        companySize?: string;
        plan?: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
        company: any;
    }>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string | undefined;
            name: any;
        };
        company: any;
    }>;
    me(userId: string): Promise<{
        id: any;
        email: any;
        name: any;
        company: any;
    }>;
}
