import {
  httpBatchLink,
  loggerLink,
} from "@trpc/client";

import { type AppRouter } from "@/server/root";
import { getUrl, transformer } from "./shared";
import { createTRPCNext } from '@trpc/next';
import { ssrPrepass } from '@trpc/next/ssrPrepass';

export const api = createTRPCNext<AppRouter>({
  transformer,
  ssr: true,
  ssrPrepass,
  config(opts) {
    const { ctx } = opts
    return {
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchLink({
          // The server needs to know your app's full url
          url: getUrl(),
          transformer,
          headers() {
            if (!ctx?.req?.headers) {
              return {};
            }
            // To use SSR properly, you need to forward client headers to the server
            // This is so you can pass through things like cookies when we're server-side rendering
            return {
              cookie: ctx.req.headers.cookie,
            };
          },
        }),
      ],
    };
  },
});