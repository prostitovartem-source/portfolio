/**
 * Рендерит "живой" код (React/TypeScript/Next.js) на canvas — используется
 * как текстура экрана 3D-монитора в Hero. Анимация детерминирована по
 * времени (без Math.random — стабильна между кадрами, не требует состояния
 * React), имитирует печать + автопрокрутку терминала.
 */

const FILENAME = "ProjectCard.tsx";

const CODE_LINES = [
  'import { useState, useEffect } from "react";',
  "",
  "interface Project {",
  "  id: string;",
  "  title: string;",
  "  stack: string[];",
  "}",
  "",
  "export function useProjects() {",
  "  const [data, setData] = useState<Project[]>([]);",
  "",
  "  useEffect(() => {",
  '    fetch("/api/projects")',
  "      .then((res) => res.json())",
  "      .then(setData);",
  "  }, []);",
  "",
  "  return data;",
  "}",
  "",
  "export async function GET() {",
  "  const projects = await db.project.findMany({",
  '    orderBy: { createdAt: "desc" },',
  "  });",
  "",
  "  return Response.json(projects);",
  "}",
  "",
  "export default function ProjectCard({ project }: Props) {",
  "  return (",
  '    <motion.article whileHover={{ y: -6 }} className="card">',
  "      <h3>{project.title}</h3>",
  "      <p>{project.description}</p>",
  "    </motion.article>",
  "  );",
  "}",
];

const FULL_TEXT = CODE_LINES.join("\n");
const CHARS_PER_SECOND = 20;
const END_PAUSE_SECONDS = 2.5;
const CYCLE_DURATION = FULL_TEXT.length / CHARS_PER_SECOND + END_PAUSE_SECONDS;

const COLORS = {
  bg: "#0a0e16",
  bgGradientTop: "#0d1220",
  chrome: "#11151f",
  divider: "rgba(125, 211, 252, 0.12)",
  lineNumber: "rgba(168, 176, 184, 0.35)",
  plain: "#e6edf3",
  keyword: "#a78bfa",
  type: "#7dd3fc",
  string: "#93c5fd",
  func: "#7dd3fc",
  comment: "#4b5563",
  punct: "#8b95a1",
  caret: "#7dd3fc",
  dotRed: "#5c4a52",
  dotYellow: "#5c5548",
  dotGreen: "#425c4d",
};

const TOKEN_RULES = [
  [/^\/\/.*/, "comment"],
  [/^(["'`])(?:\\.|(?!\1).)*\1?/, "string"],
  [
    /^\b(import|export|default|function|const|let|var|return|interface|type|async|await|new|from|extends|implements|class|if|else|for|of|in|try|catch)\b/,
    "keyword",
  ],
  [/^\b[A-Z][A-Za-z0-9]*\b/, "type"],
  [/^\b\d+(\.\d+)?\b/, "number"],
  [/^[{}()[\]<>.,;:=+\-*/&|!?]/, "punct"],
  [/^[a-zA-Z_$][a-zA-Z0-9_$]*(?=\()/, "func"],
  [/^[a-zA-Z_$][a-zA-Z0-9_$]*/, "plain"],
  [/^\s+/, "space"],
];

function tokenizeLine(line) {
  const tokens = [];
  let rest = line;
  while (rest.length) {
    let matched = false;
    for (const [re, type] of TOKEN_RULES) {
      const m = rest.match(re);
      if (m && m[0].length > 0) {
        tokens.push({ text: m[0], type });
        rest = rest.slice(m[0].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      tokens.push({ text: rest[0], type: "plain" });
      rest = rest.slice(1);
    }
  }
  return tokens;
}

function tokenColor(type) {
  switch (type) {
    case "keyword":
      return COLORS.keyword;
    case "type":
      return COLORS.type;
    case "string":
      return COLORS.string;
    case "func":
      return COLORS.func;
    case "comment":
      return COLORS.comment;
    case "number":
      return COLORS.keyword;
    case "punct":
      return COLORS.punct;
    default:
      return COLORS.plain;
  }
}

export function createCodeMonitorCanvas() {
  const width = 1024;
  const height = 640;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const barHeight = 44;
  const fontSize = 20;
  const lineHeight = 28;
  const padX = 28;
  const gutterWidth = 56;
  const visibleRows = Math.floor((height - barHeight - 24) / lineHeight);

  function draw(elapsed) {
    const t = elapsed % CYCLE_DURATION;
    const revealedLen = Math.min(Math.floor(t * CHARS_PER_SECOND), FULL_TEXT.length);
    const revealedText = FULL_TEXT.slice(0, revealedLen);
    const revealedLines = revealedText.split("\n");
    const totalRevealed = revealedLines.length;
    const visible = revealedLines.slice(-visibleRows);
    const firstLineNumber = totalRevealed - visible.length + 1;
    const isTypingDone = revealedLen >= FULL_TEXT.length;

    // Фон
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, COLORS.bgGradientTop);
    grad.addColorStop(1, COLORS.bg);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Титульная панель редактора
    ctx.fillStyle = COLORS.chrome;
    ctx.fillRect(0, 0, width, barHeight);
    ctx.fillStyle = COLORS.divider;
    ctx.fillRect(0, barHeight - 1, width, 1);

    const dotY = barHeight / 2;
    const dotColors = [COLORS.dotRed, COLORS.dotYellow, COLORS.dotGreen];
    dotColors.forEach((color, i) => {
      ctx.beginPath();
      ctx.arc(padX + i * 22, dotY, 6, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });

    ctx.font = "500 15px 'JetBrains Mono', monospace";
    ctx.fillStyle = COLORS.lineNumber;
    ctx.textBaseline = "middle";
    ctx.fillText(FILENAME, padX + 90, dotY);

    // Разделитель gutter
    ctx.fillStyle = COLORS.divider;
    ctx.fillRect(gutterWidth, barHeight, 1, height - barHeight);

    // Строки кода
    ctx.font = `500 ${fontSize}px 'JetBrains Mono', monospace`;
    ctx.textBaseline = "alphabetic";

    let y = barHeight + 30;
    visible.forEach((line, row) => {
      const lineNum = firstLineNumber + row;
      ctx.fillStyle = COLORS.lineNumber;
      ctx.textAlign = "right";
      ctx.fillText(String(lineNum), gutterWidth - 14, y);
      ctx.textAlign = "left";

      let x = gutterWidth + padX - 12;
      const tokens = tokenizeLine(line);
      for (const token of tokens) {
        ctx.fillStyle = tokenColor(token.type);
        ctx.fillText(token.text, x, y);
        x += ctx.measureText(token.text).width;
      }

      // Мигающий курсор на последней (печатаемой) строке, пока цикл не завершён
      if (!isTypingDone && row === visible.length - 1) {
        const blink = Math.floor(elapsed * 2.2) % 2 === 0;
        if (blink) {
          ctx.fillStyle = COLORS.caret;
          ctx.fillRect(x + 2, y - fontSize + 4, 9, fontSize);
        }
      }

      y += lineHeight;
    });
  }

  return { canvas, draw };
}
