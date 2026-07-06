import type { Rider } from "@/types"

/**
 * The six delivery riders. This mirrors the `riders` table that would live in
 * Supabase (id, name, color). When a database is connected, replace the reads
 * in `lib/data-store.ts` with queries against this table.
 */
export const RIDERS: Rider[] = [
  { id: "andrea", name: "Andrea Del Bianco", color: "#6366f1" },
  { id: "simone", name: "Simone Centis", color: "#06b6d4" },
  { id: "christian", name: "Christian Moretto", color: "#10b981" },
  { id: "pietro", name: "Pietro Di Falco", color: "#f59e0b" },
  { id: "malik", name: "Malik Sikandar", color: "#ec4899" },
  { id: "lorenzo", name: "Lorenzo Menegon", color: "#f43f5e" },
]
