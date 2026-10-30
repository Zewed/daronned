import { fireEvent, screen } from "@testing-library/dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { allerAuPotager, cliquer, fermerJeu, frapper, lancerJeu } from "./aide";

function combiner(premiere: string, deuxieme: string): void {
  fireEvent.change(screen.getByLabelText(/première plante/i), { target: { value: premiere } });
  fireEvent.change(screen.getByLabelText(/deuxième plante/i), { target: { value: deuxieme } });
  cliquer(/^combiner$/i);
}

describe("le joueur combine ses légumes et ses fruits et découvre leurs bonus", () => {
  beforeEach(() => {
    lancerJeu();
    allerAuPotager();
  });
  afterEach(fermerJeu);

  it("cultive des légumes et des fruits de plusieurs sortes", () => {
    cliquer(/planter une carotte/i);
    cliquer(/planter un poireau/i);
    cliquer(/planter une tomate/i);
    cliquer(/planter une fraise/i);
    const plantes = screen.getAllByTestId("plante").map((plante) => plante.textContent);
    expect(plantes).toEqual(["Carotte, graine", "Poireau, graine", "Tomate, graine", "Fraise, graine"]);
  });

  it("voit qu'aucune combinaison n'est encore trouvée", () => {
    expect(screen.getByTestId("bonus").textContent).toMatch(/aucune combinaison trouvée/i);
  });

  it("découvre un bonus visible avec une bonne combinaison", () => {
    cliquer(/planter une carotte/i);
    cliquer(/planter un poireau/i);
    combiner("Carotte", "Poireau");
    expect(screen.getByRole("status").textContent).toMatch(/bonne combinaison/i);
    expect(screen.getByTestId("bonus").textContent).toMatch(/carotte et poireau : \+2 dégâts/i);
  });

  it("voit qu'une combinaison sans effet ne donne rien", () => {
    cliquer(/planter une carotte/i);
    cliquer(/planter une fraise/i);
    combiner("Carotte", "Fraise");
    expect(screen.getByRole("status").textContent).toMatch(/rien ne se passe/i);
    expect(screen.getByTestId("bonus").textContent).toMatch(/aucune combinaison trouvée/i);
  });

  it("change le résultat d'un combat grâce au bonus", () => {
    cliquer(/planter une carotte/i);
    cliquer(/planter un poireau/i);
    cliquer(/arroser/i);
    cliquer(/arroser/i);
    combiner("Carotte", "Poireau");
    cliquer(/envoyer au combat/i);
    frapper("bien");
    expect(screen.getByTestId("vie-adversaire").textContent).toBe("1");
  });
});
