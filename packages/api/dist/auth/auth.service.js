"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let AuthService = class AuthService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async register(dto) {
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
        if (companyError)
            throw new Error(companyError.message);
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
                throw new common_1.ConflictException('User with this email already exists');
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
        if (sessionError)
            throw new Error(sessionError.message);
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
    async login(email, password) {
        const { data, error } = await this.supabase
            .getClient()
            .auth.signInWithPassword({ email, password });
        if (error)
            throw new common_1.UnauthorizedException(error.message);
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
                email: data.user.email,
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
    async me(userId) {
        const { data: profile } = await this.supabase
            .getClient()
            .from('profiles')
            .select('*, companies(*)')
            .eq('id', userId)
            .maybeSingle();
        if (!profile)
            throw new common_1.UnauthorizedException('Profile not found');
        return {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            company: profile.companies,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], AuthService);
