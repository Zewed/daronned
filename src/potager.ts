import type { Figure } from "./figures";

const ETAPES = ["graine", "pousse", "mûr", "bien mûr"];
const DERNIERE_ETAPE = ETAPES.length - 1;
const ETAPE_MURE = 2;
const DEGATS_PAR_ETAPE = [0, 0, 3, 5];

export interface Sorte {
  nom: string;
  feminin: boolean;
  figure: Figure;
}

export const SORTES: Sorte[] = [
  { nom: "Carotte", feminin: true, figure: "carotte" },
  { nom: "Poireau", feminin: false, figure: "poireau" },
  { nom: "Tomate", feminin: true, figure: "tomate" },
  { nom: "Fraise", feminin: true, figure: "fraise" },
];

const COMBINAISONS: { plantes: [string, string]; degats: number }[] = [
  { plantes: ["Carotte", "Poireau"], degats: 2 },
  { plantes: ["Tomate", "Fraise"], degats: 1 },
];

export interface Plante {
  sorte: Sorte;
  etape: number;
}

export interface Bonus {
  nom: string;
  degats: number;
}

export function planter(nom: string): Plante {
  const sorte = SORTES.find((candidate) => candidate.nom === nom) ?? SORTES[0];
  return { sorte, etape: 0 };
}

export function arroser(plante: Plante): void {
  plante.etape = Math.min(DERNIERE_ETAPE, plante.etape + 1);
}

export function etapeDe(plante: Plante): string {
  const etape = ETAPES[plante.etape];
  return plante.sorte.feminin && plante.etape >= ETAPE_MURE ? `${etape}e` : etape;
}

export function plusMure(plantes: Plante[]): Plante | undefined {
  const mures = plantes.filter((plante) => plante.etape >= ETAPE_MURE);
  return mures.sort((a, b) => b.etape - a.etape)[0];
}

export function degatsParfaitsDe(plante: Plante): number {
  return DEGATS_PAR_ETAPE[plante.etape];
}

export function combiner(premiere: string, deuxieme: string): Bonus | null {
  const trouvee = COMBINAISONS.find(
    ({ plantes }) => plantes.includes(premiere) && plantes.includes(deuxieme) && premiere !== deuxieme,
  );
  if (!trouvee) return null;
  const [a, b] = trouvee.plantes;
  return { nom: `${a} et ${b.toLowerCase()}`, degats: trouvee.degats };
}

export function degatsDesBonus(bonus: Bonus[]): number {
  return bonus.reduce((total, { degats }) => total + degats, 0);
}
