import { motion } from "framer-motion";

const Animation = ({ onAnimationComplete }) => {
  return (
    <motion.div
      className="h-screen w-full flex items-center justify-center bg-darkBg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onAnimationComplete}
    >
      <motion.h1
        className="text-primary text-6xl font-bold"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1 }}
      >
        AutoAI
      </motion.h1>
    </motion.div>
  );
};

export default Animation;
