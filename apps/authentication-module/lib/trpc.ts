import { initTRPC } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';

export const trpc = initTRPC().create({
  router: () => [
    {
      procedure: 'register',
      input: z.object({ name: z.string() }),
      output: z.object({ message: z.string() }),
      async resolve({ input }) {
        try {
          const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
          });
          return response.json();
        } catch (error) {
          console.error(error);
          return { message: 'Error registering user' };
        }
      },
    },
    {
      procedure: 'login',
      input: z.object({ name: z.string() }),
      output: z.object({ message: z.string() }),
      async resolve({ input }) {
        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
          });
          return response.json();
        } catch (error) {
          console.error(error);
          return { message: 'Error logging in user' };
        }
      },
    },
  ],
});

export const api = trpcNext.createNextApiHandler({
  router: trpc.router,
  createContext: () => null,
});