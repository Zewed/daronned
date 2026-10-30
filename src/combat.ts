export const DUREE_JAUGE_MS = 1600;
export const VIE_OIGNON = 6;
export const XP_VICTOIRE = 10;

export const DEGATS_COUP_PARFAIT = 3;
const DEGATS_COUP_RATE = 1;

export interface Zone {
  debut: number;
  fin: number;
}

export type Verdict = "parfait" | "tot" | "tard";

const CENTRE_ZONE_MS = 1120;
const LARGEUR_ZONE_MS = 240;
const LARGEUR_ZONE_MAX_MS = 700;
const ELARGISSEMENT_PAR_XP_MS = 6;

export function zoneDuBonMoment(xp: number): Zone {
  const largeur = Math.min(LARGEUR_ZONE_MAX_MS, LARGEUR_ZONE_MS + xp * ELARGISSEMENT_PAR_XP_MS);
  return { debut: CENTRE_ZONE_MS - largeur / 2, fin: CENTRE_ZONE_MS + largeur / 2 };
}

export function jugerCoup(moment: number, zone: Zone): Verdict {
  if (moment < zone.debut) return "tot";
  if (moment > zone.fin) return "tard";
  return "parfait";
}

export function degatsDuCoup(verdict: Verdict, degatsParfaits: number): number {
  return verdict === "parfait" ? degatsParfaits : DEGATS_COUP_RATE;
}

export function messageDuCoup(verdict: Verdict, degats: number): string {
  const debut = { parfait: "Coup parfait !", tot: "Trop tôt !", tard: "Trop tard !" }[verdict];
  return `${debut} L'oignon perd ${degats} point${degats > 1 ? "s" : ""} de vie.`;
}
