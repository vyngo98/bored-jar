import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jarImg from "./assets/jar.png";
import paperImg from "./assets/paper.png";
import "@fontsource/indie-flower";


export default function App() {
  const [ideas, setIdeas] = useState([]);
  const [input, setInput] = useState("");
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [flyingNote, setFlyingNote] = useState(false);


  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("ideas") || "[]");
    setIdeas(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("ideas", JSON.stringify(ideas));
  }, [ideas]);

  // const addIdea = () => {
  //   if (!input.trim()) return;
  //   setIdeas([...ideas, input]);
  //   setInput("");
  //   setShowModal(false);
  // };

  const addIdea = () => {
    if (!input.trim()) return;

    setFlyingNote(true);

    setTimeout(() => {
      setIdeas([...ideas, input]);
      setInput("");
      setShowModal(false);
      setFlyingNote(false);
    }, 600);
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
      <div className="relative">
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

      <AnimatePresence>
        {flyingNote && (
          <motion.div
            initial={{ x: 0, y: 0, scale: 1 }}
            animate={{ x: 100, y: -200, scale: 0.3, rotate: 180 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute bg-[#fff8e7] px-4 py-2 rounded shadow"
          >
            {input}
          </motion.div>
        )}
      </AnimatePresence>
      </div>

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
            initial={{ scale: 0.8, rotate: -2 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.8 }}
            className="relative w-80"
          >
            {/* PAPER IMAGE */}
            <img
              src={paperImg}
              alt="paper"
              className="w-full h-auto drop-shadow-lg"
            />

            {/* CONTENT */}
            <div className="absolute inset-0 px-10 py-12 flex flex-col justify-between">
              
              <h2 className="text-center text-lg font-semibold">
                ✨ Add new idea
              </h2>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-transparent border-b border-gray-400 outline-none text-center"
                placeholder="Write something fun..."
              />

              <div className="flex justify-center gap-3">
                <button 
                onClick={addIdea}
                className="px-4 py-1 bg-purple-200 rounded-lg shadow">
                  Save
                </button>
                <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-1 bg-gray-200 rounded-lg shadow">
                  Cancel
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
