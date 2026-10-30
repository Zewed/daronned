const FIGURES = {
  heros: `<rect x="30" y="50" width="60" height="90" rx="6" fill="#3f6b8a"/><circle cx="60" cy="30" r="24" fill="#e8b98f"/><rect x="88" y="78" width="46" height="8" rx="3" fill="#b9b9b0"/>`,
  oignon: `<path d="M60 22c-8 14-34 24-34 56 0 26 16 42 34 42s34-16 34-42c0-32-26-42-34-56z" fill="#c9712e"/><path d="M60 22c-2 28-2 60 0 98" stroke="#8a4a1c" stroke-width="3" fill="none"/><path d="M60 22c4-8 2-12 0-16" stroke="#5a7a2e" stroke-width="5" fill="none"/>`,
  daronne: `<rect x="26" y="52" width="68" height="90" rx="8" fill="#7a2f4d"/><rect x="36" y="74" width="48" height="60" rx="4" fill="#f0e2c0"/><circle cx="60" cy="30" r="24" fill="#d9a07c"/><path d="M36 26c6-22 42-22 48 0l-6 4c-10-8-26-8-36 0z" fill="#3a2a24"/>`,
  carotte: `<path d="M70 44c-18 0-30 8-26 20l26 78 26-78c4-12-8-20-26-20z" fill="#e8891c"/><path d="M70 44c-4-16-14-24-22-28M70 44c0-18 2-28 2-36M70 44c6-14 14-22 24-26" stroke="#5a7a2e" stroke-width="7" fill="none"/>`,
  poireau: `<rect x="60" y="60" width="20" height="82" rx="8" fill="#f0ead2"/><path d="M62 64c-6-22-20-38-30-50M70 64c0-22 2-40 2-56M78 64c6-22 18-38 30-48" stroke="#5a7a2e" stroke-width="10" fill="none"/>`,
  tomate: `<circle cx="70" cy="86" r="48" fill="#c8321f"/><path d="M70 42l-20-8 12 16-20 6 24 4 4 14 4-14 24-4-20-6 12-16z" fill="#5a7a2e"/>`,
  fraise: `<path d="M70 142c-30-28-48-52-48-76 0-18 22-26 48-26s48 8 48 26c0 24-18 48-48 76z" fill="#c8321f"/><path d="M70 42L44 26l14 18-24 4 26 6 10 12 10-12 26-6-24-4 14-18z" fill="#5a7a2e"/><circle cx="56" cy="78" r="3" fill="#f7e27a"/><circle cx="86" cy="74" r="3" fill="#f7e27a"/><circle cx="70" cy="102" r="3" fill="#f7e27a"/>`,
};

export type Figure = keyof typeof FIGURES;

export function figure(nom: Figure): string {
  return `<svg class="figure figure--${nom}" viewBox="0 0 140 150" role="img" aria-hidden="true">${FIGURES[nom]}</svg>`;
}
