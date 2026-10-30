export const DUREE_JAUGE_MS = 1600;
export const VIE_OIGNON = 6;
export const XP_VICTOIRE = 10;

const DEGATS_COUP_PARFAIT = 3;
const DEGATS_COUP_RATE = 1;

export interface Zone {
  debut: number;
  fin: number;
}

export type Verdict = "parfait" | "tot" | "tard";

export function zoneDuBonMoment(): Zone {
  return { debut: 1000, fin: 1240 };
}

export function jugerCoup(moment: number, zone: Zone): Verdict {
  if (moment < zone.debut) return "tot";
  if (moment > zone.fin) return "tard";
  return "parfait";
}

export function degatsDuCoup(verdict: Verdict): number {
  return verdict === "parfait" ? DEGATS_COUP_PARFAIT : DEGATS_COUP_RATE;
}

export function messageDuCoup(verdict: Verdict, degats: number): string {
  const debut = { parfait: "Coup parfait !", tot: "Trop tôt !", tard: "Trop tard !" }[verdict];
  return `${debut} L'oignon perd ${degats} point${degats > 1 ? "s" : ""} de vie.`;
}
