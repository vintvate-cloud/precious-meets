import { createServerClient } from "@supabase/ssr";

const supabaseUrl =
  (typeof process !== "undefined" && process.env?.["NEXT_PUBLIC_SUPABASE_URL"]) ||
  (typeof process !== "undefined" && process.env?.["VITE_SUPABASE_URL"]) ||
  "https://vdupycmvzsiepdrqdkrb.supabase.co";

const supabaseKey =
  (typeof process !== "undefined" && process.env?.["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]) ||
  (typeof process !== "undefined" && process.env?.["VITE_SUPABASE_ANON_KEY"]) ||
  "sb_publishable_USouOQHxjrYce4oASvxOfQ_O11xKgX1";

export const createClient = (request?: any) => {
  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          if (request?.cookies?.getAll) {
            return request.cookies.getAll();
          }
          return [];
        },
        setAll(cookiesToSet) {
          if (request?.cookies?.set) {
            cookiesToSet.forEach(({ name, value }) => {
              try {
                request.cookies.set(name, value);
              } catch {
                // Ignore if cookie cannot be mutated
              }
            });
          }
        },
      },
    },
  );
};
