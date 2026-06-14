import { CanActivate, ExecutionContext } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
export declare class JwtGuard implements CanActivate {
    private readonly supabase;
    constructor(supabase: SupabaseService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
