import z from 'zod';

// TODO
const ApplicationOptions = z
  .object({
    token: z.string(),
    id: z.string(),
    clientSecret: z.string(),
    redirectUri: z.string(),
    scopes: z.array(z.string()).optional(),
    databaseProvider: z.any().optional(),
  })
  .strict();

export default ApplicationOptions;
