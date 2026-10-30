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
import { arroser, combiner, degatsDesBonus, degatsParfaitsDe, planter, plusMure } from "./potager";

const HEROS = { nom: "Héros", figure: "heros", degatsParfaits: DEGATS_COUP_PARFAIT, annonce: "" } as const;

export function demarrerJeu(racine: HTMLElement): () => void {
  const etat: EtatJeu = {
    scene: "combat",
    combattant: HEROS,
    suiteDuCombat: "cuisine",
    vieAdversaire: VIE_OIGNON,
    message: "",
    zone: zoneDuBonMoment(0),
    coupEnCours: false,
    premiereFois: true,
    elargissementSignale: false,
    xp: 0,
    plantes: [],
    bonus: [],
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
      if (!etat.elargissementSignale) {
        etat.elargissementSignale = true;
        etat.message += " Le bon moment s'élargit !";
      }
    }
    rendre();
  }

  function lancerCoup(): void {
    departDuCoup = Date.now();
    etat.zone = zoneDuBonMoment(etat.xp);
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
    const { nom, feminin, figure } = plante.sorte;
    etat.combattant = {
      nom,
      figure,
      degatsParfaits: degatsParfaitsDe(plante) + degatsDesBonus(etat.bonus),
      annonce: `${feminin ? "La" : "Le"} ${nom.toLowerCase()} combat pour toi.`,
    };
  }

  function combinerPlantes(): void {
    const premiere = racine.querySelector<HTMLSelectElement>("#premiere-plante")?.value ?? "";
    const deuxieme = racine.querySelector<HTMLSelectElement>("#deuxieme-plante")?.value ?? "";
    const bonus = combiner(premiere, deuxieme);
    if (!bonus) {
      etat.message = "Rien ne se passe : ces deux-là ne s'entendent pas.";
    } else if (etat.bonus.some(({ nom }) => nom === bonus.nom)) {
      etat.message = "Tu connais déjà cette combinaison.";
    } else {
      etat.bonus.push(bonus);
      etat.message = "Bonne combinaison !";
    }
  }

  function surClic(evenement: MouseEvent): void {
    const cible = evenement.target as HTMLElement;
    const bouton = cible.closest<HTMLElement>("[data-action]");
    const action = bouton?.dataset.action;
    if (action === "cuisine") etat.scene = "cuisine";
    if (action === "refaire") {
      etat.vieAdversaire = VIE_OIGNON;
      etat.message = "";
    }
    if (action === "cuisiner") etat.scene = "degustation";
    if (action === "potager") {
      etat.scene = "potager";
      etat.message = "";
    }
    if (action === "planter") etat.plantes.push(planter(bouton?.dataset.sorte ?? ""));
    if (action === "arroser") etat.plantes.forEach(arroser);
    if (action === "envoyer") envoyerAuCombat();
    if (action === "combiner") combinerPlantes();
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
