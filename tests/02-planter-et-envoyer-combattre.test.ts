import { screen } from "@testing-library/dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { allerAuPotager, cliquer, fermerJeu, frapper, lancerJeu } from "./aide";

describe("le joueur plante une graine, fait mûrir un légume et l'envoie combattre", () => {
  beforeEach(() => {
    lancerJeu();
    allerAuPotager();
  });
  afterEach(fermerJeu);

  it("voit un potager vide qui l'invite à planter", () => {
    expect(screen.getByRole("heading", { name: /potager/i })).toBeTruthy();
    expect(screen.getByText(/plante une graine/i)).toBeTruthy();
  });

  it("plante une graine et voit le légume passer par des étapes distinctes", () => {
    cliquer(/planter une graine/i);
    expect(screen.getByTestId("plante").textContent).toMatch(/carotte, graine/i);
    cliquer(/arroser/i);
    expect(screen.getByTestId("plante").textContent).toMatch(/carotte, pousse/i);
    cliquer(/arroser/i);
    expect(screen.getByTestId("plante").textContent).toMatch(/carotte, mûre/i);
    cliquer(/arroser/i);
    expect(screen.getByTestId("plante").textContent).toMatch(/carotte, bien mûre/i);
  });

  it("dit pourquoi il ne peut pas envoyer de légume s'il n'y en a aucun de mûr", () => {
    cliquer(/planter une graine/i);
    cliquer(/envoyer au combat/i);
    expect(screen.getByRole("status").textContent).toMatch(/aucun légume n'est mûr/i);
    expect(screen.getByRole("heading", { name: /potager/i })).toBeTruthy();
  });

  it("envoie un légume mûr combattre et presse lui-même au bon moment", () => {
    faireMurir(2);
    cliquer(/envoyer au combat/i);
    expect(screen.getByRole("heading", { name: /combat/i })).toBeTruthy();
    expect(screen.getByText(/carotte combat pour toi/i)).toBeTruthy();
    frapper("bien");
    expect(screen.getByRole("status").textContent).toMatch(/coup parfait/i);
    expect(screen.getByTestId("vie-adversaire").textContent).toBe("3");
  });

  it("frappe plus fort avec un légume plus mûr", () => {
    faireMurir(3);
    cliquer(/envoyer au combat/i);
    frapper("bien");
    expect(screen.getByTestId("vie-adversaire").textContent).toBe("1");
  });

  it("revient au potager après la victoire d'un légume", () => {
    faireMurir(3);
    cliquer(/envoyer au combat/i);
    frapper("bien");
    frapper("bien");
    cliquer(/retour au potager/i);
    expect(screen.getByTestId("plante").textContent).toMatch(/carotte/i);
  });
});

function faireMurir(arrosages: number): void {
  cliquer(/planter une graine/i);
  for (let fois = 0; fois < arrosages; fois += 1) cliquer(/arroser/i);
}
