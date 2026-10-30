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
