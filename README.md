# 🔥 FitStreak

App de seguimiento de gimnasio: registra entrenamientos, mira tu progreso, mantén tu racha de días activos. Instalable como app en el celular (PWA). **Todos tus datos viven en tu navegador** — no requiere backend, cuenta, o conexión a internet (después del primer acceso).

**Stack:** Next.js 16 (App Router) + TypeScript + Tailwind · localStorage · Recharts · desplegado en Vercel y GitHub Pages.

## Funcionalidades

- Registro de 16 tipos de ejercicio (correr, ciclismo, pesas, natación, yoga, HIIT, zumba, CrossFit, boxeo, etc.)
- Racha de días consecutivos, con celebración en hitos (7, 30, 100 días…)
- Gráficos de progreso: calorías, distribución por tipo de ejercicio, y progresión de peso/distancia/duración por ejercicio
- Resumen mensual: sesiones, calorías, días activos, desglose por tipo, tendencia vs. mes anterior
- Perfil editable (nombre, peso corporal para cálculo de calorías)
- PWA: instalable en celular, funciona sin internet después de instalar

**Nota:** datos locales por dispositivo (no sincronizados entre dispositivos). Strava no está disponible en esta versión. Apple Fitness y Realme Link no tienen API pública para apps web.

## Requisitos

- Node.js 20+
- Navegador moderno (Chrome, Firefox, Safari, Edge)

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Build para producción

```bash
npm run build
npm run preview
```

El build genera un sitio completamente estático en `out/`, servible desde cualquier servidor HTTP.

## Desplegar en Vercel

1. Sube este repo a GitHub.
2. En [vercel.com/new](https://vercel.com/new), importa el repositorio.
3. Vercel detecta Next.js automáticamente.
4. Despliega.

Cada `git push` a `main` vuelve a desplegar automáticamente.

## Desplegar en GitHub Pages

El repo incluye un Actions workflow (`.github/workflows/deploy.yml`) que genera y despliega el sitio automáticamente en GitHub Pages.

1. Asegúrate de que el repo sea públi**c** (Settings → Visibility).
2. Habilita GitHub Pages:
   ```bash
   gh api -X POST repos/tu-usuario/gym-tracker/pages -f build_type=workflow
   ```
3. Haz `git push` a `main` — el workflow genera la compilación automáticamente.
4. La app estará en `https://tu-usuario.github.io/gym-tracker/`.

## Estructura del proyecto

```
src/
  app/
    page.tsx                    # dashboard (racha, estadísticas rápidas, lista de ejercicios)
    log/page.tsx                # registro de ejercicios
    progress/page.tsx           # gráficos de progreso
    summary/page.tsx            # resumen mensual
    settings/page.tsx           # perfil
    layout.tsx, manifest.ts
  components/
    nav/, exercises/, progress/, summary/, settings/, ui/
  lib/
    types.ts                    # tipos de datos (Profile, ExerciseEntry, AppData)
    clientStore.ts              # persistencia en localStorage
    useAppData.ts               # hook para acceder a datos + hidratación
    mutations.ts                # helpers para modificar datos
    exerciseTypes.ts, calories.ts, streak.ts, stats.ts, monthlySummary.ts, dates.ts
next.config.ts                  # exportación estática + soporte GitHub Pages (basePath condicional)
package.json
scripts/serve-static.js         # servidor HTTP simple para probar la build localmente
.github/workflows/deploy.yml    # CI/CD para GitHub Pages
```

## Notas técnicas

- **Cálculo de calorías**: estimación por fórmula MET estándar (`MET × 3.5 × peso_kg / 200` por minuto). Es una aproximación editable, no un valor médico exacto.
- **Racha**: se cuenta por días distintos con al menos un ejercicio registrado. Sigue "viva" si no has registrado hoy pero sí ayer; se rompe al saltarte un día completo.
- **Persistencia**: todo se guarda automáticamente en `localStorage` al final del navegador donde abres la app. Los datos no se sincronizan entre dispositivos.
