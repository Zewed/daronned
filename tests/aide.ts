import { fireEvent, screen } from "@testing-library/dom";
import { vi } from "vitest";
import { demarrerJeu } from "../src/jeu";

let arreter: (() => void) | undefined;

export function lancerJeu(): void {
  vi.useFakeTimers();
  document.body.innerHTML = '<div id="app"></div>';
  arreter = demarrerJeu(document.querySelector<HTMLElement>("#app")!);
}

export function fermerJeu(): void {
  arreter?.();
  arreter = undefined;
  vi.useRealTimers();
}

export function espace(): void {
  fireEvent.keyDown(document, { key: " " });
}

export function cliquer(nom: string | RegExp): void {
  fireEvent.click(screen.getByRole("button", { name: nom }));
}

export function frapper(quand: "tot" | "bien" | "tard"): void {
  espace();
  const jauge = screen.getByTestId("jauge");
  const debut = Number(jauge.dataset.debut);
  const fin = Number(jauge.dataset.fin);
  vi.advanceTimersByTime({ tot: debut - 100, bien: (debut + fin) / 2, tard: fin + 100 }[quand]);
  espace();
}

export function vaincreOignon(): void {
  frapper("bien");
  frapper("bien");
}

export function allerAuPotager(): void {
  vaincreOignon();
  cliquer(/passer en cuisine/i);
  cliquer(/cuisiner le plat/i);
  cliquer(/aller au potager/i);
}
