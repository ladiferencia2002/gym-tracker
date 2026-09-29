"use client";

import { useEffect, useState } from "react";
import { subscribePush, unsubscribePush } from "@/app/actions/push";

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

type Status = "checking" | "unsupported" | "denied" | "off" | "on" | "busy";

export function NotificationToggle() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    async function check() {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setStatus("unsupported");
        return;
      }
      if (Notification.permission === "denied") {
        setStatus("denied");
        return;
      }
      const registration = await navigator.serviceWorker.ready.catch(() => null);
      const existing = await registration?.pushManager.getSubscription();
      setStatus(existing ? "on" : "off");
    }
    check();
  }, []);

  async function enable() {
    setStatus("busy");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "off");
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) throw new Error("Falta configurar NEXT_PUBLIC_VAPID_PUBLIC_KEY.");

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
      const json = subscription.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } };
      await subscribePush(json);
      setStatus("on");
    } catch (err) {
      console.error(err);
      setStatus("off");
    }
  }

  async function disable() {
    setStatus("busy");
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await unsubscribePush(subscription.endpoint);
        await subscription.unsubscribe();
      }
      setStatus("off");
    } catch (err) {
      console.error(err);
      setStatus("on");
    }
  }

  if (status === "checking") return <p className="text-sm text-slate-500">Comprobando…</p>;
  if (status === "unsupported") {
    return <p className="text-sm text-slate-500">Tu navegador no soporta notificaciones push.</p>;
  }
  if (status === "denied") {
    return (
      <p className="text-sm text-slate-500">
        Bloqueaste las notificaciones para este sitio. Actívalas desde los ajustes del navegador.
      </p>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-slate-300">
        Recordatorio diario para entrenar {status === "on" && "— activado ✅"}
      </p>
      <button
        type="button"
        onClick={status === "on" ? disable : enable}
        disabled={status === "busy"}
        className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
          status === "on" ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-orange-500 text-white hover:bg-orange-400"
        }`}
      >
        {status === "busy" ? "…" : status === "on" ? "Desactivar" : "Activar"}
      </button>
    </div>
  );
}
