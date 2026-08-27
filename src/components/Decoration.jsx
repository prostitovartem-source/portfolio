/** Абстрактные декоративные SVG-фигуры — свои, без внешних хотлинков. */

export function RingDecoration({ className }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" aria-hidden="true">
      <circle cx="100" cy="100" r="90" stroke="#A8B0B8" strokeWidth="1" opacity="0.5" />
      <circle cx="100" cy="100" r="60" stroke="#7DD3FC" strokeWidth="1.5" opacity="0.7" />
      <circle cx="100" cy="30" r="6" fill="#7DD3FC" />
    </svg>
  );
}

export function BracketsDecoration({ className }) {
  return (
    <svg viewBox="0 0 200 160" className={className} fill="none" aria-hidden="true">
      <path
        d="M70 20 L20 80 L70 140"
        stroke="#A8B0B8"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
      <path
        d="M130 20 L180 80 L130 140"
        stroke="#7DD3FC"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
    </svg>
  );
}

export function GridDecoration({ className }) {
  const dots = [];
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      dots.push(
        <circle
          key={`${x}-${y}`}
          cx={20 + x * 30}
          cy={20 + y * 30}
          r={(x + y) % 3 === 0 ? 4 : 2}
          fill={(x + y) % 3 === 0 ? "#7DD3FC" : "#A8B0B8"}
          opacity={(x + y) % 3 === 0 ? 0.85 : 0.4}
        />
      );
    }
  }
  return (
    <svg viewBox="0 0 160 160" className={className} aria-hidden="true">
      {dots}
    </svg>
  );
}

export function OrbitDecoration({ className }) {
  return (
    <svg viewBox="0 0 220 220" className={className} fill="none" aria-hidden="true">
      <ellipse cx="110" cy="110" rx="100" ry="45" stroke="#A8B0B8" strokeWidth="1" opacity="0.5" />
      <ellipse
        cx="110"
        cy="110"
        rx="100"
        ry="45"
        stroke="#7DD3FC"
        strokeWidth="1.5"
        opacity="0.7"
        transform="rotate(60 110 110)"
      />
      <circle cx="110" cy="110" r="14" fill="#7DD3FC" opacity="0.9" />
    </svg>
  );
}
