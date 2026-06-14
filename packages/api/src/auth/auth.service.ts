import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(private readonly supabase: SupabaseService) {}

  async register(dto: {
    email: string;
    password: string;
    name: string;
    companyName?: string;
    companySize?: string;
    plan?: string;
  }) {
    // 1. Create company
    const { data: company, error: companyError } = await this.supabase
      .getClient()
      .from('companies')
      .insert({
        name: dto.companyName || dto.name + "'s Company",
        size: dto.companySize,
        plan: dto.plan || 'starter',
      })
      .select()
      .single();

    if (companyError) throw new Error(companyError.message);

    // 2. Create auth user in Supabase
    const { data: authData, error: authError } = await this.supabase
      .getClient()
      .auth.admin.createUser({
        email: dto.email,
        password: dto.password,
        email_confirm: true,
        user_metadata: { name: dto.name, company_id: company.id },
      });

    if (authError) {
      await this.supabase.getClient().from('companies').delete().eq('id', company.id);
      
      if (authError.message?.includes('already been registered') || authError.message?.includes('already exists')) {
        throw new ConflictException('User with this email already exists');
      }
      
      throw new Error(authError.message);
    }

    // 3. Create profile linked to company — NO role
    const { error: profileError } = await this.supabase
      .getClient()
      .from('profiles')
      .insert({
        id: authData.user.id,
        name: dto.name,
        email: dto.email,
        company_id: company.id,
        status: 'active',
      });

    if (profileError) {
      await this.supabase.getClient().from('companies').delete().eq('id', company.id);
      await this.supabase.getClient().auth.admin.deleteUser(authData.user.id);
      throw new Error(profileError.message);
    }

    // 4. Get session token from Supabase
    const { data: sessionData, error: sessionError } = await this.supabase
      .getClient()
      .auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });

    if (sessionError) throw new Error(sessionError.message);

    return {
      accessToken: sessionData.session.access_token,
      refreshToken: sessionData.session.refresh_token,
      user: {
        id: authData.user.id,
        email: dto.email,
        name: dto.name,
      },
      company,
    };
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase
      .getClient()
      .auth.signInWithPassword({ email, password });

    if (error) throw new UnauthorizedException(error.message);

    // Get profile with company
    const { data: profile } = await this.supabase
      .getClient()
      .from('profiles')
      .select('*, companies(*)')
      .eq('id', data.user.id)
      .maybeSingle();

    // If no profile, create one with a default company — NO role
    if (!profile) {
      const { data: company } = await this.supabase
        .getClient()
        .from('companies')
        .insert({
          name: (data.user.email?.split('@')[0] || 'User') + "'s Company",
          plan: 'starter',
        })
        .select()
        .single();

      await this.supabase
        .getClient()
        .from('profiles')
        .insert({
          id: data.user.id,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
          email: data.user.email!,
          company_id: company?.id,
          status: 'active',
        });

      return {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
        },
        company: company || null,
      };
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || data.user.user_metadata?.name,
      },
      company: profile?.companies || null,
    };
  }

  async me(userId: string) {
    const { data: profile } = await this.supabase
      .getClient()
      .from('profiles')
      .select('*, companies(*)')
      .eq('id', userId)
      .maybeSingle();

    if (!profile) throw new UnauthorizedException('Profile not found');

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      company: profile.companies,
    };
  }
}