import z from 'zod';
declare const ApplicationOptions: z.ZodObject<{
    token: z.ZodString;
    id: z.ZodString;
    clientSecret: z.ZodString;
    redirectUri: z.ZodString;
    scopes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    databaseProvider: z.ZodOptional<z.ZodAny>;
}, "strict", z.ZodTypeAny, {
    scopes?: string[] | undefined;
    databaseProvider?: any;
    id: string;
    token: string;
    clientSecret: string;
    redirectUri: string;
}, {
    scopes?: string[] | undefined;
    databaseProvider?: any;
    id: string;
    token: string;
    clientSecret: string;
    redirectUri: string;
}>;
export default ApplicationOptions;
//# sourceMappingURL=ApplicationOptions.d.ts.map