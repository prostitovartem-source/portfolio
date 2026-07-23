/** Абстрактные декоративные SVG-фигуры — свои, без внешних хотлинков. */

export function RingDecoration({ className }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      <circle cx="100" cy="100" r="90" stroke="#646973" strokeWidth="1" opacity="0.5" />
      <circle cx="100" cy="100" r="60" stroke="#BBCCD7" strokeWidth="1.5" opacity="0.7" />
      <circle cx="100" cy="30" r="6" fill="#BBCCD7" />
    </svg>
  );
}

export function BracketsDecoration({ className }) {
  return (
    <svg viewBox="0 0 200 160" className={className} fill="none">
      <path
        d="M70 20 L20 80 L70 140"
        stroke="#646973"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
      <path
        d="M130 20 L180 80 L130 140"
        stroke="#BBCCD7"
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
          fill={(x + y) % 3 === 0 ? "#BBCCD7" : "#646973"}
          opacity={(x + y) % 3 === 0 ? 0.85 : 0.4}
        />
      );
    }
  }
  return (
    <svg viewBox="0 0 160 160" className={className}>
      {dots}
    </svg>
  );
}

export function OrbitDecoration({ className }) {
  return (
    <svg viewBox="0 0 220 220" className={className} fill="none">
      <ellipse cx="110" cy="110" rx="100" ry="45" stroke="#646973" strokeWidth="1" opacity="0.5" />
      <ellipse
        cx="110"
        cy="110"
        rx="100"
        ry="45"
        stroke="#BBCCD7"
        strokeWidth="1.5"
        opacity="0.7"
        transform="rotate(60 110 110)"
      />
      <circle cx="110" cy="110" r="14" fill="#BBCCD7" opacity="0.9" />
    </svg>
  );
}
