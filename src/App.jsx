import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jarImg from "./assets/jar.png";
import paperImg from "./assets/paper.png";
import scrollImg from "./assets/scroll.png";
import stickerImg from "./assets/greatjob.png";
import "@fontsource/indie-flower";


export default function App() {
  const [input, setInput] = useState("");
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [flyingScroll, setFlyingScroll] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const [ideas, setIdeas] = useState(() => {
    return JSON.parse(localStorage.getItem("ideas") || "[]");
  });

  const activeIdeas = ideas.filter(i => !i.completed);


  useEffect(() => {
    localStorage.setItem("ideas", JSON.stringify(ideas));
  }, [ideas]);


  const addIdea = () => {
    if (!input.trim()) return;

    setFlyingScroll(true);

    setTimeout(() => {
      const newIdea = {
        id: Date.now(),
        text: input,
        completed: false
      };

      setIdeas(prev => [...prev, newIdea]);

      setInput("");
      setShowModal(false);
      setFlyingScroll(false);
    }, 700);
  };
  

  const randomPick = () => {
  if (activeIdeas.length === 0) return;

  let random;
  do {
    random = activeIdeas[Math.floor(Math.random() * activeIdeas.length)];
  } while (selectedIdea && random.id === selectedIdea.id && activeIdeas.length > 1);

  setSelectedIdea(random);
};

  const deleteIdea = (id) => {
    setIdeas(prev => prev.filter(item => item.id !== id));
    setSelectedIdea(null);
  };


  const completeIdea = (id) => {
  setIdeas(prev =>
    prev.map(item =>
      item.id === id ? { ...item, completed: true } : item
    )
  );

  // 🔥 update selectedIdea luôn
  setSelectedIdea(prev =>
    prev ? { ...prev, completed: true } : prev
  );
};

  const completedCount = ideas.filter(i => i.completed).length;


  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">🌸 Bored Jar</h1>

      {/* Jar */}
      <div className="relative">

        {/* JAR */}
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


        

        {/* 🔢 COUNTER */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            key={activeIdeas.length}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-bold text-white drop-shadow-lg"
          >
            {activeIdeas.length}
          </motion.div>

        {/* <AnimatePresence>
          {flyingScroll && (
            <motion.img
              src={scrollImg}
              className="absolute w-16"
              
              initial={{ x: 0, y: 0, scale: 1, rotate: 0 }}
              animate={{ x: 100, y: -200, scale: 0.3, rotate: 180 }}
              exit={{ opacity: 0 }}
              
              transition={{ duration: 0.7, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence> */}
        </div>
      </div>

      {/* COMPLETED COUNT */}
      <div className="mt-4 text-center">
        <button
          onClick={() => setShowCompleted(true)}
          className="bg-white px-4 py-2 rounded-xl shadow"
        >
          ✅ Completed: {completedCount}
        </button>
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
            initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center"
          >
            <div className="relative w-80 overflow-hidden">

              {/* PAPER */}
              <img
                src={paperImg}
                className="w-full h-auto drop-shadow-lg"
              />

              {/* CONTENT */}
              <div className="absolute inset-0 px-10 py-12 flex flex-col justify-between">

                <h2 className="text-center font-semibold">
                  🎲 Your idea
                </h2>

                <p className="text-center text-lg break-words">
                  {selectedIdea.text}
                </p>


                {selectedIdea.completed && (
                  <motion.img
                    src={stickerImg}
                    alt="sticker"
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: [0, 1.2, 1], rotate: -15 }}
                    transition={{ duration: 0.5, ease: "backOut" }}
                    className="
                      absolute 
                      top-4 left-4     /* 👈 góc trên trái */
                      w-20             /* 👈 nhỏ lại */
                      drop-shadow-lg 
                      opacity-90
                      pointer-events-none
                    "
                  />
                )}


                {/* BUTTONS */}
                <div className="flex justify-center gap-3 flex-wrap">

                  <button
                    onClick={() => completeIdea(selectedIdea.id)}
                    disabled={selectedIdea.completed}
                    className="px-4 py-1 bg-green-200 rounded-lg shadow disabled:opacity-50"
                  >
                    Complete
                  </button>

                  <button
                    onClick={() => deleteIdea(selectedIdea.id)}
                    className="px-4 py-1 bg-red-200 rounded-lg shadow"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => setSelectedIdea(null)}
                    className="px-4 py-1 bg-gray-200 rounded-lg shadow"
                  >
                    Close
                  </button>

                </div>

              </div>
            </div>
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

      {/* Modal list completed ideas */}
      <AnimatePresence>
        {showCompleted && (
          <motion.div
            className="fixed inset-0 bg-black/30 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white p-6 rounded-xl w-80 max-h-[70vh] overflow-y-auto">
              <h2 className="text-lg font-bold mb-3">✅ Completed Ideas</h2>

              {ideas.filter(i => i.completed).length === 0 ? (
                <p className="text-center text-gray-500">No completed ideas yet</p>
              ) : (
                ideas
                  .filter(i => i.completed)
                  .map(item => (
                    <div key={item.id} className="mb-2 p-2 bg-gray-100 rounded">
                      {item.text}
                    </div>
                  ))
              )}

              <button
                onClick={() => setShowCompleted(false)}
                className="mt-4 w-full bg-gray-200 py-2 rounded"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
