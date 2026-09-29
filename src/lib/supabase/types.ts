// Hand-written types matching supabase/schema.sql, shaped to satisfy
// @supabase/postgrest-js's GenericSchema/GenericTable constraints (Tables +
// Views + Functions at the schema level; Row/Insert/Update/Relationships per
// table). If you change the schema, update this file to match - or generate
// it from the live project with the Supabase CLI instead:
//   npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts

export type ExerciseSource = "manual" | "strava";

export type ExerciseRow = {
  id: string;
  user_id: string;
  type: string;
  performed_on: string; // "YYYY-MM-DD"
  duration_minutes: number;
  distance_km: number | null;
  weight_kg: number | null;
  reps: number | null;
  sets: number | null;
  calories: number;
  notes: string | null;
  source: ExerciseSource;
  external_id: string | null;
  created_at: string;
};

export type ExerciseInsert = Omit<ExerciseRow, "id" | "created_at"> &
  Partial<Pick<ExerciseRow, "id" | "created_at">>;

export type ProfileRow = {
  id: string;
  display_name: string | null;
  body_weight_kg: number;
  created_at: string;
};

export type ProfileUpdate = Partial<Omit<ProfileRow, "id" | "created_at">>;

export type PushSubscriptionRow = {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth_key: string;
  created_at: string;
};

export type PushSubscriptionInsert = Omit<PushSubscriptionRow, "id" | "created_at"> &
  Partial<Pick<PushSubscriptionRow, "id" | "created_at">>;

export type StravaConnectionRow = {
  user_id: string;
  athlete_id: number | null;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  last_synced_at: string | null;
  created_at: string;
};

export type StravaConnectionUpsert = Omit<StravaConnectionRow, "created_at" | "last_synced_at"> &
  Partial<Pick<StravaConnectionRow, "created_at" | "last_synced_at">>;

type Table<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<ProfileRow, Partial<ProfileRow> & Pick<ProfileRow, "id">, ProfileUpdate>;
      exercises: Table<ExerciseRow, ExerciseInsert, Partial<ExerciseRow>>;
      push_subscriptions: Table<PushSubscriptionRow, PushSubscriptionInsert, Partial<PushSubscriptionRow>>;
      strava_connections: Table<StravaConnectionRow, StravaConnectionUpsert, Partial<StravaConnectionRow>>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
