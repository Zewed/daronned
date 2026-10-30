import {
  DEGATS_COUP_PARFAIT,
  DUREE_JAUGE_MS,
  VIE_OIGNON,
  XP_VICTOIRE,
  degatsDuCoup,
  jugerCoup,
  messageDuCoup,
  zoneDuBonMoment,
} from "./combat";
import { ecran, type EtatJeu } from "./ecrans";
import { arroser, degatsParfaitsDe, planter, plusMure } from "./potager";

const HEROS = { nom: "Héros", figure: "heros", degatsParfaits: DEGATS_COUP_PARFAIT } as const;

export function demarrerJeu(racine: HTMLElement): () => void {
  const etat: EtatJeu = {
    scene: "combat",
    combattant: HEROS,
    suiteDuCombat: "cuisine",
    vieAdversaire: VIE_OIGNON,
    message: "",
    zone: zoneDuBonMoment(),
    coupEnCours: false,
    premiereFois: true,
    xp: 0,
    plantes: [],
  };
  let departDuCoup = 0;
  let finDuCoup: ReturnType<typeof setTimeout> | undefined;

  function rendre(): void {
    racine.innerHTML = ecran(etat);
  }

  function resoudreCoup(moment: number): void {
    clearTimeout(finDuCoup);
    etat.coupEnCours = false;
    etat.premiereFois = false;
    const verdict = jugerCoup(moment, etat.zone);
    const degats = degatsDuCoup(verdict, etat.combattant.degatsParfaits);
    etat.vieAdversaire = Math.max(0, etat.vieAdversaire - degats);
    etat.message = messageDuCoup(verdict, degats);
    if (etat.vieAdversaire === 0) {
      etat.xp += XP_VICTOIRE;
      etat.message += " L'oignon est vaincu.";
    }
    rendre();
  }

  function lancerCoup(): void {
    departDuCoup = Date.now();
    etat.coupEnCours = true;
    etat.message = "";
    finDuCoup = setTimeout(() => resoudreCoup(DUREE_JAUGE_MS), DUREE_JAUGE_MS);
    rendre();
  }

  function surTouche(evenement: KeyboardEvent): void {
    if (evenement.key !== " " || etat.scene !== "combat" || etat.vieAdversaire === 0) return;
    evenement.preventDefault();
    if (etat.coupEnCours) resoudreCoup(Date.now() - departDuCoup);
    else lancerCoup();
  }

  function envoyerAuCombat(): void {
    const plante = plusMure(etat.plantes);
    if (!plante) {
      etat.message = "Aucun légume n'est mûr : arrose encore avant de l'envoyer au combat.";
      return;
    }
    etat.message = "";
    etat.scene = "combat";
    etat.vieAdversaire = VIE_OIGNON;
    etat.suiteDuCombat = "potager";
    etat.combattant = { nom: plante.nom, figure: "carotte", degatsParfaits: degatsParfaitsDe(plante) };
  }

  function surClic(evenement: MouseEvent): void {
    const cible = evenement.target as HTMLElement;
    const action = cible.closest<HTMLElement>("[data-action]")?.dataset.action;
    if (action === "cuisine") etat.scene = "cuisine";
    if (action === "cuisiner") etat.scene = "degustation";
    if (action === "potager") {
      etat.scene = "potager";
      etat.message = "";
    }
    if (action === "planter") etat.plantes.push(planter());
    if (action === "arroser") etat.plantes.forEach(arroser);
    if (action === "envoyer") envoyerAuCombat();
    rendre();
  }

  document.addEventListener("keydown", surTouche);
  racine.addEventListener("click", surClic);
  rendre();

  return () => {
    clearTimeout(finDuCoup);
    document.removeEventListener("keydown", surTouche);
    racine.removeEventListener("click", surClic);
    racine.innerHTML = "";
  };
}
