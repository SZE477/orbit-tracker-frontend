import { z } from 'zod';
declare const configSchema: z.ZodObject<{
    VITE_API_BASE: z.ZodString;
    VITE_WS_BASE: z.ZodString;
    VITE_MOCK_API: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    VITE_API_BASE: string;
    VITE_WS_BASE: string;
    VITE_MOCK_API: boolean;
}, {
    VITE_API_BASE: string;
    VITE_WS_BASE: string;
    VITE_MOCK_API: boolean;
}>;
type Config = z.infer<typeof configSchema>;
export declare const config: Config;
export {};
