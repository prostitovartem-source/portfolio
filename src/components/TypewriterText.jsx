import { motion } from "framer-motion";

const container = (startDelay, stagger) => ({
  hidden: {},
  visible: {
    transition: { delayChildren: startDelay, staggerChildren: stagger },
  },
});

const charVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.01 } },
};

/** Текст, "печатающийся" по одному символу спустя startDelay после монтирования. */
export default function TypewriterText({ as: Tag = "span", text, startDelay = 0.5, stagger = 0.045, className }) {
  const MotionTag = motion[Tag] ?? motion.span;
  const chars = text.split("");

  return (
    <MotionTag
      className={className}
      variants={container(startDelay, stagger)}
      initial="hidden"
      animate="visible"
    >
      {chars.map((char, i) => (
        <motion.span key={i} variants={charVariant} style={{ display: "inline-block" }}>
          {char === " " ? " " : char}
        </motion.span>
      ))}
      <motion.span
        className="typewriter-cursor"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        transition={{ delay: startDelay }}
      >
        |
      </motion.span>
    </MotionTag>
  );
}
