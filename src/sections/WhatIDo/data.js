import { t } from "../../i18n/index.js";

// Тот же реальный контент, что был в старой ServicesSection — переносим
// дословно, эта задача про форму подачи, не про текст. Название/описание/
// деко идут из словаря, tech (реальные названия технологий) не переводится.
const SERVICE_IDS = ["websites", "webapps", "saas", "ai", "interactive"];
const TECH = {
  websites: ["React", "Next.js"],
  webapps: ["React", "Node.js"],
  saas: ["PostgreSQL", "Prisma"],
  ai: ["Replicate", "AI APIs"],
  interactive: ["Framer Motion", "Three.js"],
};

export const SERVICES = SERVICE_IDS.map((id, i) => {
  const s = t(`whatIdo.services.${id}`);
  return {
    number: String(i + 1).padStart(2, "0"),
    name: s.name,
    description: s.description,
    tech: TECH[id],
    deco: s.deco,
  };
});
