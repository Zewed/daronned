import { screen } from "@testing-library/dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cliquer, espace, fermerJeu, frapper, lancerJeu, vaincreOignon } from "./aide";

function largeurDuBonMoment(): number {
  espace();
  const jauge = screen.getByTestId("jauge");
  const largeur = Number(jauge.dataset.fin) - Number(jauge.dataset.debut);
  vi.advanceTimersByTime(5000);
  return largeur;
}

function farmer(combats: number): void {
  for (let fois = 0; fois < combats; fois += 1) {
    vaincreOignon();
    cliquer(/refaire le combat/i);
  }
}

describe("plus le joueur farme, plus le bon moment s'élargit", () => {
  beforeEach(lancerJeu);
  afterEach(fermerJeu);

  it("voit son total d'xp monter à chaque combat gagné", () => {
    farmer(2);
    expect(screen.getByTestId("xp").textContent).toBe("20");
  });

  it("peut refaire un combat pour farmer", () => {
    vaincreOignon();
    cliquer(/refaire le combat/i);
    expect(screen.getByTestId("vie-adversaire").textContent).toBe("6");
    expect(screen.getByRole("heading", { name: /combat/i })).toBeTruthy();
  });

  it("voit le bon moment s'élargir quand l'xp monte", () => {
    const debut = largeurDuBonMoment();
    farmer(1);
    const apresUnCombat = largeurDuBonMoment();
    farmer(2);
    const apresTroisCombats = largeurDuBonMoment();
    expect(apresUnCombat).toBeGreaterThan(debut);
    expect(apresTroisCombats).toBeGreaterThan(apresUnCombat);
  });

  it("rate toujours un coup hors du bon moment, même avec beaucoup d'xp", () => {
    farmer(20);
    frapper("tot");
    expect(screen.getByRole("status").textContent).toMatch(/trop tôt/i);
    vi.advanceTimersByTime(1000);
    frapper("tard");
    expect(screen.getByRole("status").textContent).toMatch(/trop tard/i);
  });

  it("signale la première fois que le bon moment s'élargit, et seulement celle-là", () => {
    vaincreOignon();
    expect(screen.getByRole("status").textContent).toMatch(/bon moment s'élargit/i);
    cliquer(/refaire le combat/i);
    vaincreOignon();
    expect(screen.getByRole("status").textContent).not.toMatch(/bon moment s'élargit/i);
  });
});
