import {
  DUREE_JAUGE_MS,
  VIE_OIGNON,
  XP_VICTOIRE,
  degatsDuCoup,
  jugerCoup,
  messageDuCoup,
  zoneDuBonMoment,
} from "./combat";
import { ecran, type EtatJeu } from "./ecrans";

export function demarrerJeu(racine: HTMLElement): () => void {
  const etat: EtatJeu = {
    scene: "combat",
    vieAdversaire: VIE_OIGNON,
    message: "",
    zone: zoneDuBonMoment(),
    coupEnCours: false,
    premiereFois: true,
    xp: 0,
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
    const degats = degatsDuCoup(verdict);
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

  function surClic(evenement: MouseEvent): void {
    const cible = evenement.target as HTMLElement;
    const action = cible.closest<HTMLElement>("[data-action]")?.dataset.action;
    if (action === "cuisine") etat.scene = "cuisine";
    if (action === "cuisiner") etat.scene = "degustation";
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
