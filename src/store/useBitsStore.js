// store/useBitsStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../api/axios"; // configured axios instance

const useBitsStore = create(
  persist(
    (set, get) => ({
      // State
      bits: [],
      groupedBits: { basic: [], intermediate: [], advanced: [] },
      loading: false,
      generating: false,
      error: null,

      // Fetch all bits
      fetchBits: async () => {
        set({ loading: true, error: null });
        try {
          const res = await axios.get("/bits");
          set({ bits: Array.isArray(res.data) ? res.data : [], loading: false });
        } catch (err) {
          set({ error: "Failed to fetch bits", loading: false });
          console.error("Error fetching bits:", err);
        }
      },

      // Fetch grouped bits
      fetchGroupedBits: async () => {
        set({ loading: true, error: null });
        try {
          const res = await axios.get("/bits/grouped");
          set({
            groupedBits: res.data || { basic: [], intermediate: [], advanced: [] },
            loading: false
          });
        } catch (err) {
          set({ error: "Failed to fetch grouped bits", loading: false });
          console.error("Error fetching grouped bits:", err);
        }
      },

      // Generate a full learning path (all levels)
      generateAllLevels: async (title, options = {}) => {
        set({ generating: true, error: null });
        try {
          const payload = {
            title,
            topic: options.topic || title,
            category: options.category || 'general',
            language: options.language || 'en',
            generateAllLevels: true
          };

          const res = await axios.post("/bits/generate-all", payload);
          const newBitSeries = res.data;

          const currentBits = get().bits || [];
          set({ bits: [newBitSeries, ...currentBits], generating: false });
          return newBitSeries;
        } catch (err) {
          set({ error: "Failed to generate complete learning path", generating: false });
          console.error("Error generating all levels:", err);
          throw err;
        }
      },

      // Update progress for a specific question
      updateProgress: async (bitId, level, questionIndex, isCorrect) => {
        try {
          const res = await axios.patch(`/bits/${bitId}/progress`, {
            level,
            questionIndex,
            isCorrect
          });

          const currentBits = get().bits || [];
          const updatedBits = currentBits.map(bit => 
            bit._id === bitId ? { ...bit, userProgress: res.data.userProgress } : bit
          );
          set({ bits: updatedBits });

          return res.data;
        } catch (err) {
          console.error("Error updating progress:", err);
          throw err;
        }
      },

      // Get progress for a specific bit
      getProgressForBit: async (bitId) => {
        try {
          const { data } = await axios.get(`/bits/${bitId}/progress`);
          set(state => ({
            bits: state.bits.map(bit =>
              bit._id === bitId ? { ...bit, userProgress: data.levels } : bit
            )
          }));
          return data;
        } catch (err) {
          console.error("Error fetching progress for bit:", err);
          throw err;
        }
      },

      // Local analytics computation
      getAnalytics: (bitId) => {
        const { bits } = get();
        const bit = bits.find(b => b._id === bitId);
        if (!bit) return null;

        const levels = ['basic', 'intermediate', 'advanced'];
        const analytics = {
          overallCompletion: 0,
          levelsCompleted: {},
          levelsUnlocked: {},
          scores: {},
          totalQuestionsAnswered: 0
        };

        let totalCompletion = 0;
        let totalQuestions = 0;

        levels.forEach(level => {
          const progress = bit.userProgress?.[level] || { completed: false, unlocked: level === 'basic', score: 0, answeredQuestions: [] };
          const quizLength = bit.levels?.[level]?.quiz?.length || 0;
          const answered = progress.answeredQuestions?.length || 0;

          analytics.levelsCompleted[level] = progress.completed || false;
          analytics.levelsUnlocked[level] = progress.unlocked ?? (level === 'basic');
          analytics.scores[level] = progress.score || 0;
          analytics.totalQuestionsAnswered += answered;

          // Completion percentage per level
          totalCompletion += quizLength ? (answered / quizLength) : 0;
          totalQuestions += 1; // count level
        });

        analytics.overallCompletion = Math.round((totalCompletion / totalQuestions) * 100);

        return analytics;
      },

      // Reset store
      reset: () => set({
        bits: [],
        groupedBits: { basic: [], intermediate: [], advanced: [] },
        loading: false,
        generating: false,
        error: null
      })
    }),
    {
      name: "bits-storage",
      partialize: (state) => ({
        bits: state.bits,
        groupedBits: state.groupedBits
      })
    }
  )
);

export default useBitsStore;
