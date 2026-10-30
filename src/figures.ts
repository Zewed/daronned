const FIGURES = {
  heros: `<rect x="30" y="50" width="60" height="90" rx="6" fill="#3f6b8a"/><circle cx="60" cy="30" r="24" fill="#e8b98f"/><rect x="88" y="78" width="46" height="8" rx="3" fill="#b9b9b0"/>`,
  oignon: `<path d="M60 22c-8 14-34 24-34 56 0 26 16 42 34 42s34-16 34-42c0-32-26-42-34-56z" fill="#c9712e"/><path d="M60 22c-2 28-2 60 0 98" stroke="#8a4a1c" stroke-width="3" fill="none"/><path d="M60 22c4-8 2-12 0-16" stroke="#5a7a2e" stroke-width="5" fill="none"/>`,
  daronne: `<rect x="26" y="52" width="68" height="90" rx="8" fill="#7a2f4d"/><rect x="36" y="74" width="48" height="60" rx="4" fill="#f0e2c0"/><circle cx="60" cy="30" r="24" fill="#d9a07c"/><path d="M36 26c6-22 42-22 48 0l-6 4c-10-8-26-8-36 0z" fill="#3a2a24"/>`,
  carotte: `<path d="M70 44c-18 0-30 8-26 20l26 78 26-78c4-12-8-20-26-20z" fill="#e8891c"/><path d="M70 44c-4-16-14-24-22-28M70 44c0-18 2-28 2-36M70 44c6-14 14-22 24-26" stroke="#5a7a2e" stroke-width="7" fill="none"/>`,
};

export type Figure = keyof typeof FIGURES;

export function figure(nom: Figure): string {
  return `<svg class="figure figure--${nom}" viewBox="0 0 140 150" role="img" aria-hidden="true">${FIGURES[nom]}</svg>`;
}
