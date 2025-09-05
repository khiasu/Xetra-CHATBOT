import { motion } from 'framer-motion';

const LoadingDots = ({ className = '', dotClassName = 'bg-purple-400' }) => {
  const dots = [0, 1, 2];
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const dot = {
    hidden: { 
      y: -10,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 10,
      },
    },
  };

  return (
    <motion.div 
      className={`flex space-x-2 p-3 ${className}`}
      variants={container}
      initial="hidden"
      animate="show"
      aria-label="Loading..."
    >
      {dots.map((i) => (
        <motion.span
          key={i}
          variants={dot}
          className={`block w-2.5 h-2.5 rounded-full ${dotClassName} shadow-sm`}
          animate={{
            y: ['0%', '-50%', '0%'],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
            delay: i * 0.15,
          }}
        />
      ))}
    </motion.div>
  );
};

export default LoadingDots;
