import jsPDF from "jspdf";
import type { AppData } from "./types";
import { firstDayOfMonth, lastDayOfMonth, monthLabel } from "./dates";
import { computeMonthlySummary } from "./monthlySummary";
import { computeSleepStats } from "./sleepStats";
import { exerciseTypeMeta } from "./exerciseTypes";

export function generateMonthlyPDF(data: AppData, monthId: string): void {
  const monthStart = firstDayOfMonth(monthId);
  const monthEnd = lastDayOfMonth(monthId);

  const exercises = data.exercises.filter((e) => e.performedOn >= monthStart && e.performedOn <= monthEnd);
  const sleepEntries = data.sleep.filter((s) => s.date >= monthStart && s.date <= monthEnd);

  const summary = computeMonthlySummary(exercises, []);
  const sleepStats = computeSleepStats(sleepEntries);

  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 15;

  const addText = (text: string, size: number = 12, bold: boolean = false) => {
    doc.setFontSize(size);
    const fontStyle = bold ? "bold" : "normal";
    doc.setFont("helvetica", fontStyle as "normal" | "bold" | "bolditalic" | "italic");
    doc.text(text, 15, yPosition);
    yPosition += size / 2.5;
  };

  const addSpacer = () => {
    yPosition += 5;
  };

  // Header
  addText("FitStreak - Resumen Mensual", 18, true);
  addText(`${monthLabel(monthId)}`, 14, true);
  addSpacer();

  // Exercise summary
  addText("Entrenamientos", 14, true);
  addText(`Total de sesiones: ${summary.totalSessions}`);
  addText(`Calorías quemadas: ${summary.totalCalories.toLocaleString("es")} kcal`);
  addText(`Días activos: ${summary.activeDays}`);
  addText(`Minutos totales: ${summary.totalMinutes.toLocaleString("es")} min`);
  addSpacer();

  // Exercise breakdown
  if (summary.byType.length > 0) {
    addText("Desglose por tipo de ejercicio", 12, true);
    for (const item of summary.byType.slice(0, 8)) {
      const meta = exerciseTypeMeta(item.type);
      addText(`${meta.emoji} ${meta.label}: ${item.sessions} sesiones, ${item.calories} kcal`);
    }
    addSpacer();
  }

  // Sleep summary
  if (sleepStats.totalNights > 0) {
    addText("Sueño", 14, true);
    addText(`Noches registradas: ${sleepStats.totalNights}`);
    addText(`Promedio de sueño: ${sleepStats.avgDurationHours}h`);
    const moodLabels = { terrible: "Terrible", mal: "Mal", normal: "Normal", bien: "Bien", excelente: "Excelente" };
    for (const mood of ["excelente", "bien", "normal", "mal", "terrible"] as const) {
      if (sleepStats.moodCounts[mood] > 0) {
        addText(`${moodLabels[mood]}: ${sleepStats.moodCounts[mood]} noches`);
      }
    }
  }

  // Footer
  yPosition = pageHeight - 10;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Generado: ${new Date().toLocaleDateString("es")}`, 15, yPosition);

  // Download
  doc.save(`fitstreak-resumen-${monthId}.pdf`);
}
