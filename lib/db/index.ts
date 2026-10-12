import { isSupabaseConfigured, supabaseStore } from "./supabase";
import { localStore } from "./local-store";

export const db = isSupabaseConfigured ? supabaseStore : localStore;

export const dbProvider = isSupabaseConfigured ? "supabase-postgresql" : "local-embedded";
