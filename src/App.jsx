import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jarImg from "./assets/jar.png";


export default function App() {
  const [ideas, setIdeas] = useState([]);
  const [input, setInput] = useState("");
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("ideas") || "[]");
    setIdeas(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("ideas", JSON.stringify(ideas));
  }, [ideas]);

  const addIdea = () => {
    if (!input.trim()) return;
    setIdeas([...ideas, input]);
    setInput("");
    setShowModal(false);
  };

  const randomPick = () => {
    if (ideas.length === 0) return;
    const random = ideas[Math.floor(Math.random() * ideas.length)];
    setSelectedIdea(random);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">🌸 Bored Jar</h1>

      {/* Jar */}
      <motion.div
        onClick={randomPick}
        whileTap={{ scale: 0.95 }}
        animate={selectedIdea ? { rotate: [0, -5, 5, -5, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="w-40 h-56 flex items-center justify-center cursor-pointer"
      >
        <motion.img
          src={jarImg}
          alt="Jar"
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </motion.div>
      
      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-white rounded-xl shadow"
        >
          + Add Idea
        </button>

        <button
          onClick={randomPick}
          className="px-4 py-2 bg-white rounded-xl shadow"
        >
          🎲 Random
        </button>
      </div>

      {/* Reveal */}
      <AnimatePresence>
        {selectedIdea && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 bg-white p-4 rounded-xl shadow"
          >
            {selectedIdea}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/30 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-6 rounded-2xl shadow-lg"
            >
              <h2 className="mb-2">Add new idea ✨</h2>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="border p-2 rounded w-full mb-3"
                placeholder="Write something fun..."
              />
              <div className="flex gap-2">
                <button
                  onClick={addIdea}
                  className="px-3 py-1 bg-purple-200 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
