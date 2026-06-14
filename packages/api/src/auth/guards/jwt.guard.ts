import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];

    const { data, error } = await this.supabase
      .getAuthClient()
      .auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid token');
    }

    // Fetch profile
    const { data: profile } = await this.supabase
      .getClient()
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    request.user = {
      sub: data.user.id,
      email: data.user.email,
      company_id: profile?.company_id || '', // <-- Ensure it's never undefined
      ...profile,
    };

    return true;
  }
}