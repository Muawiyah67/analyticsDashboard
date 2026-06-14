import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: any): Promise<{
        success: boolean;
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
            user: {
                id: string;
                email: string;
                name: string;
            };
            company: any;
        };
    }>;
    login(dto: {
        email: string;
        password: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
            user: {
                id: string;
                email: string | undefined;
                name: any;
            };
            company: any;
        };
    }>;
    me(req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id: any;
            email: any;
            name: any;
            company: any;
        };
    }>;
}
