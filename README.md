# 🔥 FitStreak

App de seguimiento de gimnasio: registra entrenamientos, mira tu progreso, mantén tu racha de días activos y recibe recordatorios. Instalable como app en el celular (PWA).

**Stack:** Next.js 16 (App Router) + TypeScript + Tailwind · Supabase (Postgres + Auth) · Recharts · Web Push · Strava API · desplegado en Vercel.

## Funcionalidades

- Registro de 16 tipos de ejercicio (correr, ciclismo, pesas, natación, yoga, HIIT, zumba, CrossFit, boxeo, etc.)
- Racha de días consecutivos, con celebración en hitos (7, 30, 100 días…)
- Gráficos de progreso: calorías, distribución por tipo de ejercicio, y progresión de peso/distancia/duración por ejercicio
- Resumen mensual: sesiones, calorías, días activos, desglose por tipo, tendencia vs. mes anterior
- Notificaciones push diarias (recordatorio + celebración de racha)
- Integración con Strava (importa tus actividades)
- Autenticación por correo/contraseña, datos por usuario con Row Level Security

**Sobre Apple Fitness y Realme Link:** ninguno de los dos publica una API web pública para apps de terceros (Apple Fitness/HealthKit solo es accesible desde apps nativas de iOS), así que no se pueden conectar directamente. Si tu reloj sincroniza a Strava automáticamente, esos entrenamientos sí se importan a través de la integración de Strava.

## 1. Requisitos

- Node.js 20+
- Una cuenta gratis en [Supabase](https://supabase.com) (sin tarjeta)
- Una cuenta gratis en [Vercel](https://vercel.com) para desplegar
- Opcional: cuenta de [Strava](https://www.strava.com) para la integración

## 2. Configurar Supabase

1. Crea un proyecto en [supabase.com/dashboard](https://supabase.com/dashboard).
2. Ve a **SQL Editor** → **New query**, pega todo el contenido de [`supabase/schema.sql`](supabase/schema.sql) y ejecútalo. Crea las tablas, los índices y las políticas de seguridad (RLS).
3. Ve a **Project Settings → API** y copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - La clave pública (aparece como **anon public** o **publishable**, según tu proyecto) → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - La clave secreta (**service_role** o **secret**) → `SUPABASE_SERVICE_ROLE_KEY` (nunca la compartas ni la pongas en el cliente)
4. Por defecto Supabase pide confirmar el correo al registrarse. Si quieres desactivarlo para probar más rápido: **Authentication → Providers → Email → Confirm email → Off**.

## 3. Configurar notificaciones push (VAPID)

Genera un par de llaves con:

```bash
npx web-push generate-vapid-keys
```

Copia la `Public Key` a `NEXT_PUBLIC_VAPID_PUBLIC_KEY` y la `Private Key` a `VAPID_PRIVATE_KEY`. `VAPID_SUBJECT` es un `mailto:` con tu correo (Web Push lo exige, no se muestra a nadie).

`CRON_SECRET` puede ser cualquier cadena aleatoria — protege el endpoint que dispara los recordatorios diarios.

## 4. Configurar Strava (opcional)

1. Ve a [strava.com/settings/api](https://www.strava.com/settings/api) y crea una app.
2. En **Authorization Callback Domain** pon tu dominio sin `https://` (ej. `localhost` en desarrollo, o `tu-app.vercel.app` en producción).
3. Copia el **Client ID** → `STRAVA_CLIENT_ID` y el **Client Secret** → `STRAVA_CLIENT_SECRET`.
4. `NEXT_PUBLIC_APP_URL` debe ser la URL exacta donde corre la app (`http://localhost:3000` en desarrollo).

Si no configuras esto, todo el resto de la app funciona igual — solo el botón "Conectar con Strava" no funcionará.

## 5. Variables de entorno

```bash
cp .env.example .env.local
```

Completa `.env.local` con los valores de los pasos anteriores.

## 6. Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## 7. Desplegar en Vercel

1. Sube este repo a GitHub (o usa el que ya tienes).
2. En [vercel.com/new](https://vercel.com/new), importa el repositorio.
3. En **Environment Variables**, agrega las mismas variables de tu `.env.local` (con las URLs de producción: `NEXT_PUBLIC_APP_URL` y el callback de Strava apuntando a tu dominio real de Vercel).
4. Despliega. Vercel detecta Next.js automáticamente.
5. El cron de recordatorios diarios (`vercel.json`) se activa solo — no necesitas configurarlo aparte. Por defecto corre a las 22:00 UTC; ajusta el `schedule` en `vercel.json` a la hora que prefieras (formato cron, en UTC).

Cada `git push` a `main` vuelve a desplegar automáticamente.

## Estructura del proyecto

```
src/
  app/
    (app)/            # rutas protegidas: dashboard, log, progress, summary, settings
    actions/           # Server Actions (mutaciones)
    api/                # rutas HTTP: auth callback, cron, OAuth de Strava
    login/, signup/     # autenticación
    page.tsx            # landing pública
  components/           # UI por área (auth, dashboard, exercises, progress, settings, nav)
  lib/
    supabase/            # clientes de Supabase (browser, server, proxy, tipos)
    data/                 # consultas de solo lectura reutilizadas por páginas y actions
    exerciseTypes.ts, calories.ts, streak.ts, stats.ts, monthlySummary.ts, dates.ts
    strava.ts             # OAuth + mapeo de actividades de Strava
  proxy.ts                # antes "middleware.ts" (Next.js 16 lo renombró) - refresca la sesión
supabase/schema.sql        # esquema completo de la base de datos (RLS incluido)
public/sw.js                # service worker: caché de la app + push notifications
```

## Notas técnicas

- **Cálculo de calorías**: estimación por fórmula MET estándar (`MET × 3.5 × peso_kg / 200` por minuto). Es una aproximación editable, no un valor médico exacto.
- **Racha**: se cuenta por días distintos con al menos un ejercicio registrado. Sigue "viva" si no has registrado hoy pero sí ayer; se rompe al saltarte un día completo.
- **Seguridad**: cada tabla tiene Row Level Security — un usuario solo puede leer/escribir sus propios datos. El cron de recordatorios usa la `service_role` key (server-only) porque necesita leer de todos los usuarios suscritos.
