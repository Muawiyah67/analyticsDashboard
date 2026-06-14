import { SupabaseClient } from '@supabase/supabase-js';
export declare class SupabaseService {
    private adminClient;
    private authClient;
    constructor();
    getClient(): SupabaseClient;
    getAuthClient(): SupabaseClient;
}
