import { z } from 'zod';

const configSchema = z.object({
  VITE_API_BASE: z.string().url(),
  VITE_WS_BASE: z.string().url(),
  VITE_MOCK_API: z.boolean(),
});

type Config = z.infer<typeof configSchema>;

export const config: Config = configSchema.parse({
  VITE_API_BASE: import.meta.env.VITE_API_BASE,
  VITE_WS_BASE: import.meta.env.VITE_WS_BASE,
  VITE_MOCK_API: import.meta.env.VITE_MOCK_API === 'true',
});