import { z } from 'zod';
import { publicQuery, publicMutation } from '../lib/crpc';
import { user } from './schema';

export const list = publicQuery
  .input(z.object({ limit: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    return ctx.orm.query.user.findMany({
      limit: input.limit ?? 10,
      with: {
        posts: {
          limit: 5,
          orderBy: { createdAt: 'desc' },
          columns: {
            id: true,
            createdAt: true,
            title: true,
            published: true,
          },
        },
      },
    });
  });

export const create = publicMutation
  .input(z.object({ name: z.string(), email: z.string() }))
  .output(z.string())
  .mutation(async ({ ctx, input }) => {
    const [row] = await ctx.orm
      .insert(user)
      .values(input)
      .returning({ id: user.id });
    return row.id;
  });