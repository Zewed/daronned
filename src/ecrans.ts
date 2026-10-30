import { DUREE_JAUGE_MS, type Zone } from "./combat";
import { figure, type Figure } from "./figures";
import { etapeDe, type Plante } from "./potager";

export type Scene = "combat" | "cuisine" | "degustation" | "potager";

export interface Combattant {
  nom: string;
  figure: Figure;
  degatsParfaits: number;
}

export interface EtatJeu {
  scene: Scene;
  combattant: Combattant;
  suiteDuCombat: "cuisine" | "potager";
  vieAdversaire: number;
  message: string;
  zone: Zone;
  coupEnCours: boolean;
  premiereFois: boolean;
  xp: number;
  plantes: Plante[];
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

function boutonApresCombat(etat: EtatJeu): string {
  return etat.suiteDuCombat === "cuisine"
    ? `<button type="button" data-action="cuisine">Passer en cuisine</button>`
    : `<button type="button" data-action="potager">Retour au potager</button>`;
}

function ecranCombat(etat: EtatJeu): string {
  const aide = etat.premiereFois
    ? `<p class="aide">Appuie sur Espace pour lancer le coup, puis encore sur Espace quand le curseur est dans la zone.</p>`
    : "";
  const suite = etat.vieAdversaire === 0 ? boutonApresCombat(etat) : "";
  const annonce =
    etat.combattant.figure === "heros" ? "" : `<p>La ${etat.combattant.nom.toLowerCase()} combat pour toi.</p>`;
  return `
    <h1>Combat</h1>
    <div class="arene ${etat.message ? "arene--frappe" : ""}">
      ${figure(etat.combattant.figure)}
      ${figure("oignon")}
    </div>
    ${annonce}
    <p class="adversaire">Oignon, <span data-testid="vie-adversaire">${etat.vieAdversaire}</span> point${etat.vieAdversaire > 1 ? "s" : ""} de vie</p>
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
    <button type="button" data-action="potager">Aller au potager</button>
  `;
}

function ecranPotager(etat: EtatJeu): string {
  const plantes = etat.plantes.length
    ? `<ul class="parcelles">${etat.plantes
        .map((plante) => `<li data-testid="plante">${plante.nom}, ${etapeDe(plante)}</li>`)
        .join("")}</ul>`
    : `<p class="aide">Ton potager est vide. Plante une graine pour commencer.</p>`;
  const arroser = etat.plantes.length
    ? `<button type="button" data-action="arroser">Arroser</button>`
    : "";
  return `
    <h1>Potager</h1>
    ${plantes}
    <p role="status" class="message">${etat.message}</p>
    <div class="actions">
      <button type="button" data-action="planter">Planter une graine</button>
      ${arroser}
      <button type="button" data-action="envoyer">Envoyer au combat</button>
    </div>
  `;
}

const ECRANS: Record<Scene, (etat: EtatJeu) => string> = {
  combat: ecranCombat,
  cuisine: ecranCuisine,
  degustation: ecranDegustation,
  potager: ecranPotager,
};

export function ecran(etat: EtatJeu): string {
  return `
    <section class="scene">
      <p class="etiquette">Xp <span data-testid="xp">${etat.xp}</span></p>
      ${ECRANS[etat.scene](etat)}
    </section>
  `;
}
