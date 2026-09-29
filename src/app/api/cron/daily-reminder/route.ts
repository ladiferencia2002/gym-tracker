import { NextResponse } from "next/server";
import webpush from "web-push";
import { createServiceClient } from "@/lib/supabase/service";
import { computeStreaks } from "@/lib/streak";
import { addDays, todayLocal } from "@/lib/dates";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function reminderMessage(currentStreak: number, loggedToday: boolean): { title: string; body: string } {
  if (loggedToday) {
    return { title: "🔥 FitStreak", body: `¡Ya entrenaste hoy! Racha de ${currentStreak} días.` };
  }
  if (currentStreak >= 3) {
    return {
      title: "🔥 No rompas tu racha",
      body: `Llevas ${currentStreak} días seguidos. Un entrenamiento corto hoy y sigues.`,
    };
  }
  return { title: "💪 FitStreak", body: "Hoy es un buen día para entrenar. Registra tu sesión." };
}

// Vercel Cron calls this once a day with `Authorization: Bearer $CRON_SECRET`.
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  const vapidSubject = process.env.VAPID_SUBJECT;
  if (!vapidPublic || !vapidPrivate || !vapidSubject) {
    return NextResponse.json({ error: "missing VAPID config" }, { status: 500 });
  }
  webpush.setVapidDetails(vapidSubject, vapidPublic, vapidPrivate);

  const supabase = createServiceClient();
  const today = todayLocal();
  const since = addDays(today, -60);

  const [{ data: subscriptions }, { data: exercises }] = await Promise.all([
    supabase.from("push_subscriptions").select("*"),
    supabase.from("exercises").select("user_id, performed_on").gte("performed_on", since),
  ]);

  const datesByUser = new Map<string, string[]>();
  for (const e of exercises ?? []) {
    const list = datesByUser.get(e.user_id) ?? [];
    list.push(e.performed_on);
    datesByUser.set(e.user_id, list);
  }

  let sent = 0;
  let removed = 0;

  for (const sub of subscriptions ?? []) {
    const dates = datesByUser.get(sub.user_id) ?? [];
    const { current } = computeStreaks(dates, today);
    const loggedToday = dates.includes(today);
    const { title, body } = reminderMessage(current, loggedToday);

    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth_key },
        },
        JSON.stringify({ title, body, url: "/dashboard" })
      );
      sent += 1;
    } catch (err: unknown) {
      const statusCode = (err as { statusCode?: number } | null)?.statusCode;
      if (statusCode === 404 || statusCode === 410) {
        await supabase.from("push_subscriptions").delete().eq("id", sub.id);
        removed += 1;
      }
    }
  }

  return NextResponse.json({ sent, removed, total: subscriptions?.length ?? 0 });
}
