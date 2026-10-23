import { createServerClient, type CookieOptions } from "@supabase/ssr";

const supabaseUrl =
  (typeof process !== "undefined" && process.env?.["NEXT_PUBLIC_SUPABASE_URL"]) ||
  (typeof process !== "undefined" && process.env?.["VITE_SUPABASE_URL"]) ||
  "https://vdupycmvzsiepdrqdkrb.supabase.co";

const supabaseKey =
  (typeof process !== "undefined" && process.env?.["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]) ||
  (typeof process !== "undefined" && process.env?.["VITE_SUPABASE_ANON_KEY"]) ||
  "sb_publishable_USouOQHxjrYce4oASvxOfQ_O11xKgX1";

export interface GenericCookieStore {
  getAll?: () => Array<{ name: string; value: string }> | Record<string, string>;
  set?: (name: string, value: string, options?: CookieOptions) => void;
  setAll?: (cookies: Array<{ name: string; value: string; options?: CookieOptions }>) => void;
}

export const createClient = (cookieStore?: any) => {
  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          if (!cookieStore) return [];
          if (typeof cookieStore.getAll === "function") {
            const cookies = cookieStore.getAll();
            if (Array.isArray(cookies)) return cookies;
            if (cookies && typeof cookies === "object") {
              return Object.entries(cookies).map(([name, value]) => ({
                name,
                value: String(value),
              }));
            }
          }
          return [];
        },
        setAll(cookiesToSet) {
          try {
            if (cookieStore?.setAll) {
              cookieStore.setAll(cookiesToSet);
            } else if (cookieStore?.set) {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options),
              );
            }
          } catch {
            // Ignored if called from read-only server component
          }
        },
      },
    },
  );
};
