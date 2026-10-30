import { screen } from "@testing-library/dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { vi } from "vitest";
import { cliquer, espace, fermerJeu, lancerJeu } from "./aide";

function zone(): { debut: number; fin: number } {
  const jauge = screen.getByTestId("jauge");
  return { debut: Number(jauge.dataset.debut), fin: Number(jauge.dataset.fin) };
}

function frapper(quand: "tot" | "bien" | "tard"): void {
  espace();
  const { debut, fin } = zone();
  const moment = { tot: debut - 100, bien: (debut + fin) / 2, tard: fin + 100 }[quand];
  vi.advanceTimersByTime(moment);
  espace();
}

describe("le joueur vainc un oignon, le cuisine, et la daronne le goûte", () => {
  beforeEach(lancerJeu);
  afterEach(fermerJeu);

  it("fait plus de dégâts en pressant au bon moment", () => {
    frapper("bien");
    expect(screen.getByRole("status").textContent).toMatch(/coup parfait/i);
    expect(screen.getByTestId("vie-adversaire").textContent).toBe("3");
    vi.advanceTimersByTime(1000);
    frapper("tard");
    expect(screen.getByTestId("vie-adversaire").textContent).toBe("2");
  });

  it("montre à l'écran un coup pressé trop tôt ou trop tard", () => {
    frapper("tot");
    expect(screen.getByRole("status").textContent).toMatch(/trop tôt/i);
    vi.advanceTimersByTime(1000);
    frapper("tard");
    expect(screen.getByRole("status").textContent).toMatch(/trop tard/i);
  });

  it("passe à la cuisine une fois l'oignon vaincu, et la daronne goûte le plat", () => {
    frapper("bien");
    frapper("bien");
    expect(screen.getByRole("status").textContent).toMatch(/oignon est vaincu/i);
    cliquer(/passer en cuisine/i);
    expect(screen.getByRole("heading", { name: /cuisine/i })).toBeTruthy();
    cliquer(/cuisiner le plat/i);
    expect(screen.getByRole("heading", { name: /la daronne goûte/i })).toBeTruthy();
    expect(screen.getByTestId("remarque-daronne").textContent).not.toBe("");
  });

  it("montre le total d'xp gagné après le combat", () => {
    expect(screen.getByTestId("xp").textContent).toBe("0");
    frapper("bien");
    frapper("bien");
    expect(screen.getByTestId("xp").textContent).toBe("10");
  });

  it("n'accepte plus de coup une fois l'oignon vaincu", () => {
    frapper("bien");
    frapper("bien");
    espace();
    expect(screen.queryByTestId("jauge")).toBeNull();
  });

  it("compte un coup comme trop tard si le joueur ne presse rien", () => {
    espace();
    vi.advanceTimersByTime(5000);
    expect(screen.getByRole("status").textContent).toMatch(/trop tard/i);
  });

  it("arrive dans un combat contre un oignon au lancement", () => {
    expect(screen.getByRole("heading", { name: /combat/i })).toBeTruthy();
    expect(screen.getByText(/oignon/i)).toBeTruthy();
  });

  it("montre quelle touche presser la première fois", () => {
    expect(screen.getByText(/espace/i)).toBeTruthy();
  });
});
