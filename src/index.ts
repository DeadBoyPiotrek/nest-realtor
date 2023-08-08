import { z } from 'zod';

const envVariables = z.object({
  DATABASE_UR: z.string(),
  JSON_TOKEN_KEY: z.string(),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
