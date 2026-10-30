import { DUREE_JAUGE_MS, type Zone } from "./combat";
import { figure, type Figure } from "./figures";
import { SORTES, etapeDe, type Bonus, type Plante } from "./potager";

export type Scene = "combat" | "cuisine" | "degustation" | "potager";

export interface Combattant {
  nom: string;
  figure: Figure;
  degatsParfaits: number;
  annonce: string;
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
  elargissementSignale: boolean;
  xp: number;
  plantes: Plante[];
  bonus: Bonus[];
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
  const suite =
    etat.suiteDuCombat === "cuisine"
      ? `<button type="button" data-action="cuisine">Passer en cuisine</button>`
      : `<button type="button" data-action="potager">Retour au potager</button>`;
  return `
    <div class="actions">
      ${suite}
      <button type="button" data-action="refaire">Refaire le combat</button>
    </div>`;
}

function ecranCombat(etat: EtatJeu): string {
  const aide = etat.premiereFois
    ? `<p class="aide">Appuie sur Espace pour lancer le coup, puis encore sur Espace quand le curseur est dans la zone.</p>`
    : "";
  const suite = etat.vieAdversaire === 0 ? boutonApresCombat(etat) : "";
  const annonce = etat.combattant.annonce ? `<p>${etat.combattant.annonce}</p>` : "";
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

function blocCombiner(etat: EtatJeu): string {
  const noms = [...new Set(etat.plantes.map((plante) => plante.sorte.nom))];
  const options = noms.map((nom) => `<option value="${nom}">${nom}</option>`).join("");
  return `
    <div class="actions">
      <label>Première plante <select id="premiere-plante">${options}</select></label>
      <label>Deuxième plante <select id="deuxieme-plante">${options}</select></label>
      <button type="button" data-action="combiner">Combiner</button>
    </div>`;
}

function blocBonus(etat: EtatJeu): string {
  const contenu = etat.bonus.length
    ? `<ul>${etat.bonus.map(({ nom, degats }) => `<li>${nom} : +${degats} dégâts</li>`).join("")}</ul>`
    : `<p>Aucune combinaison trouvée pour l'instant.</p>`;
  return `<div class="note" data-testid="bonus">${contenu}</div>`;
}

function ecranPotager(etat: EtatJeu): string {
  const plantes = etat.plantes.length
    ? `<ul class="parcelles">${etat.plantes
        .map((plante) => `<li data-testid="plante">${plante.sorte.nom}, ${etapeDe(plante)}</li>`)
        .join("")}</ul>`
    : `<p class="aide">Ton potager est vide. Plante une graine pour commencer.</p>`;
  const arroser = etat.plantes.length
    ? `<button type="button" data-action="arroser">Arroser</button>`
    : "";
  const planter = SORTES.map(
    ({ nom, feminin }) =>
      `<button type="button" data-action="planter" data-sorte="${nom}">Planter ${feminin ? "une" : "un"} ${nom.toLowerCase()}</button>`,
  ).join("");
  return `
    <h1>Potager</h1>
    ${plantes}
    <p role="status" class="message">${etat.message}</p>
    <div class="actions">
      ${planter}
      ${arroser}
      <button type="button" data-action="envoyer">Envoyer au combat</button>
    </div>
    ${etat.plantes.length > 1 ? blocCombiner(etat) : ""}
    ${blocBonus(etat)}
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
