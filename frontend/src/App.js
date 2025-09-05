import { useEffect } from 'react';
import { motion } from 'framer-motion';
import useStore from './store';
import ChatInterface from './components/ChatInterface';

function App() {
  const { darkMode } = useStore();

  // Set initial theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen flex flex-col"
      >
        <ChatInterface />
      </motion.div>
    </div>
  );
}

export default App;
