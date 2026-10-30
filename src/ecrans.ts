import { DUREE_JAUGE_MS, type Zone } from "./combat";
import { figure } from "./figures";

export type Scene = "combat" | "cuisine" | "degustation";

export interface EtatJeu {
  scene: Scene;
  vieAdversaire: number;
  message: string;
  zone: Zone;
  coupEnCours: boolean;
  premiereFois: boolean;
  xp: number;
}

function jauge(zone: Zone): string {
  const debut = (zone.debut / DUREE_JAUGE_MS) * 100;
  const largeur = ((zone.fin - zone.debut) / DUREE_JAUGE_MS) * 100;
  return `
    <div class="jauge" data-testid="jauge" data-debut="${zone.debut}" data-fin="${zone.fin}"
         style="--duree: ${DUREE_JAUGE_MS}ms; --zone-debut: ${debut}%; --zone-largeur: ${largeur}%">
      <span class="jauge__zone"></span>
      <span class="jauge__curseur"></span>
    </div>`;
}

function ecranCombat(etat: EtatJeu): string {
  const aide = etat.premiereFois
    ? `<p class="aide">Appuie sur Espace pour lancer le coup, puis encore sur Espace quand le curseur est dans la zone.</p>`
    : "";
  const suite =
    etat.vieAdversaire === 0
      ? `<button type="button" data-action="cuisine">Passer en cuisine</button>`
      : "";
  return `
    <h1>Combat</h1>
    <div class="arene ${etat.message ? "arene--frappe" : ""}">
      ${figure("heros")}
      ${figure("oignon")}
    </div>
    <p class="adversaire">Oignon, <span data-testid="vie-adversaire">${etat.vieAdversaire}</span> points de vie</p>
    ${aide}
    ${etat.coupEnCours ? jauge(etat.zone) : ""}
    <p role="status" class="message">${etat.message}</p>
    ${suite}
  `;
}

function ecranCuisine(): string {
  return `
    <h1>Cuisine</h1>
    <p>L'oignon attend sur la planche.</p>
    <button type="button" data-action="cuisiner">Cuisiner le plat</button>
  `;
}

function ecranDegustation(): string {
  return `
    <h1>La daronne goûte</h1>
    <div class="arene">${figure("daronne")}</div>
    <p class="note" data-testid="remarque-daronne">Ça se mange.</p>
  `;
}

const ECRANS: Record<Scene, (etat: EtatJeu) => string> = {
  combat: ecranCombat,
  cuisine: ecranCuisine,
  degustation: ecranDegustation,
};

export function ecran(etat: EtatJeu): string {
  return `
    <section class="scene">
      <p class="etiquette">Xp <span data-testid="xp">${etat.xp}</span></p>
      ${ECRANS[etat.scene](etat)}
    </section>
  `;
}
