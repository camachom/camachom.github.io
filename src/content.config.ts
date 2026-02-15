import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: "./src/data/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      author: z.string().optional().default('Martin Camacho'),
      tags: z.array(z.string()).optional().default([]),
      series: z.array(z.string()).optional(),
      description: z.string().optional().default(''),
      pubDate: z.string().transform((str) => new Date(str)),
      imgUrl: image().optional(),
      draft: z.boolean().optional().default(false),
      mathjax: z.boolean().optional().default(false),
    }),
});

export const collections = {
  blog: blogCollection,
};
