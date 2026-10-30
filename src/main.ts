import { demarrerJeu } from "./jeu";
import "./style.css";

const racine = document.querySelector<HTMLElement>("#app");

if (racine) {
  demarrerJeu(racine);
}
