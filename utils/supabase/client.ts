import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  (typeof process !== "undefined" && process.env?.["NEXT_PUBLIC_SUPABASE_URL"]) ||
  (typeof process !== "undefined" && process.env?.["VITE_SUPABASE_URL"]) ||
  (import.meta as any).env?.["NEXT_PUBLIC_SUPABASE_URL"] ||
  (import.meta as any).env?.["VITE_SUPABASE_URL"] ||
  "https://vwnzblezshaeydtjkdex.supabase.co";

const supabaseKey =
  (typeof process !== "undefined" && process.env?.["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]) ||
  (typeof process !== "undefined" && process.env?.["VITE_SUPABASE_ANON_KEY"]) ||
  (import.meta as any).env?.["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"] ||
  (import.meta as any).env?.["VITE_SUPABASE_ANON_KEY"] ||
  "sb_publishable_BSiLVSGaKsB9TtYusVefmw_F6T89Evp";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
