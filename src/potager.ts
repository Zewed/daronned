const ETAPES = ["graine", "pousse", "mûre", "bien mûre"];
const DERNIERE_ETAPE = ETAPES.length - 1;
const ETAPE_MURE = 2;
const DEGATS_PAR_ETAPE = [0, 0, 3, 5];

export interface Plante {
  nom: string;
  etape: number;
}

export function planter(): Plante {
  return { nom: "Carotte", etape: 0 };
}

export function arroser(plante: Plante): void {
  plante.etape = Math.min(DERNIERE_ETAPE, plante.etape + 1);
}

export function etapeDe(plante: Plante): string {
  return ETAPES[plante.etape];
}

export function plusMure(plantes: Plante[]): Plante | undefined {
  const mures = plantes.filter((plante) => plante.etape >= ETAPE_MURE);
  return mures.sort((a, b) => b.etape - a.etape)[0];
}

export function degatsParfaitsDe(plante: Plante): number {
  return DEGATS_PAR_ETAPE[plante.etape];
}
