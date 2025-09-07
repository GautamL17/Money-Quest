// store/useBitsStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../api/axios"; // use your configured axios instance

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

      // Fetch bits by difficulty level
      fetchBitsByDifficulty: async (difficulty) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.get(`/bits/difficulty/${difficulty}`);
          set({ bits: Array.isArray(res.data) ? res.data : [], loading: false });
        } catch (err) {
          set({ error: `Failed to fetch ${difficulty} bits`, loading: false });
          console.error("Error fetching bits by difficulty:", err);
        }
      },

      // Fetch bits grouped by difficulty
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

      // Generate a single bit with options
      generateBit: async (title, options = {}) => {
        set({ generating: true, error: null });
        try {
          const payload = {
            title,
            topic: options.topic || title,
            category: options.category || 'general',
            difficulty: options.difficulty || 'basic',
            language: options.language || 'en'
          };

          const res = await axios.post("/bits/generate", payload);
          const newBit = res.data;
          
          // Add to existing bits array
          const currentBits = get().bits || [];
          set({ 
            bits: [newBit, ...currentBits], 
            generating: false 
          });

          return newBit;
        } catch (err) {
          set({ error: "Failed to generate bit", generating: false });
          console.error("Error generating bit:", err);
          throw err;
        }
      },

      // Generate bits for all three difficulty levels as one learning path
      generateAllLevels: async (title, options = {}) => {
        set({ generating: true, error: null });
        try {
          const payload = {
            title,
            topic: options.topic || title,
            category: options.category || 'general',
            language: options.language || 'en',
            generateAllLevels: true // Flag to tell backend to create all 3 levels
          };

          // This should create one "bit series" with all 3 difficulty levels
          const res = await axios.post("/bits/generate-all", payload);
          const newBitSeries = res.data;

          // Add to existing bits array
          const currentBits = get().bits || [];
          set({ 
            bits: [newBitSeries, ...currentBits], 
            generating: false 
          });

          return newBitSeries;
        } catch (err) {
          set({ error: "Failed to generate complete learning path", generating: false });
          console.error("Error generating all levels:", err);
          throw err;
        }
      },

      // NEW: Update user progress for a specific question
      updateProgress: async (bitId, level, questionIndex, isCorrect) => {
        try {
          const res = await axios.patch(`/bits/${bitId}/progress`, {
            level,
            questionIndex,
            isCorrect
          });

          // Update the local state with the new progress data
          const currentBits = get().bits || [];
          const updatedBits = currentBits.map(bit => {
            if (bit._id === bitId) {
              return {
                ...bit,
                userProgress: res.data.userProgress
              };
            }
            return bit;
          });

          set({ bits: updatedBits });

          return res.data;
        } catch (err) {
          console.error("Error updating progress:", err);
          throw err;
        }
      },

      // Delete a bit
      deleteBit: async (bitId) => {
        try {
          await axios.delete(`/bits/${bitId}`);
          
          // Remove from local state
          const currentBits = get().bits || [];
          set({ bits: currentBits.filter(bit => bit._id !== bitId) });
          
          return true;
        } catch (err) {
          set({ error: "Failed to delete bit" });
          console.error("Error deleting bit:", err);
          throw err;
        }
      },

      // Update bit statistics (for tracking user progress)
      updateBitStats: async (bitId, score, completed = false) => {
        try {
          // This endpoint needs to be implemented in your backend
          await axios.patch(`/bits/${bitId}/stats`, { score, completed });
          
          // Update local state optimistically
          const currentBits = get().bits || [];
          const updatedBits = currentBits.map(bit => {
            if (bit._id === bitId) {
              const currentStats = bit.stats || { totalAttempts: 0, completions: 0, averageScore: 0 };
              return {
                ...bit,
                stats: {
                  ...currentStats,
                  totalAttempts: currentStats.totalAttempts + 1,
                  completions: completed ? currentStats.completions + 1 : currentStats.completions,
                  averageScore: completed ? 
                    ((currentStats.averageScore * currentStats.completions + score) / (currentStats.completions + 1))
                    : currentStats.averageScore
                }
              };
            }
            return bit;
          });
          
          set({ bits: updatedBits });
        } catch (err) {
          console.error("Error updating bit stats:", err);
          // Don't set error state for stats updates as it's not critical
        }
      },

      // Utility functions (these work with local state, no API calls)
      getBitsByCategory: (category) => {
        const { bits } = get();
        return (bits || []).filter(bit => bit.category === category);
      },

      getBitsByDifficultyLocal: (difficulty) => {
        const { bits } = get();
        return (bits || []).filter(bit => bit.difficulty === difficulty);
      },

      searchBits: (query) => {
        const { bits } = get();
        if (!query || !Array.isArray(bits)) return bits || [];
        
        const lowercaseQuery = query.toLowerCase();
        return bits.filter(bit => 
          bit.title?.toLowerCase().includes(lowercaseQuery) ||
          bit.content?.toLowerCase().includes(lowercaseQuery) ||
          bit.topic?.toLowerCase().includes(lowercaseQuery) ||
          bit.category?.toLowerCase().includes(lowercaseQuery)
        );
      },

      // Get bits by popularity (based on stats)
      getPopularBits: (limit = 10) => {
        const { bits } = get();
        return (bits || [])
          .filter(bit => bit.stats?.completions > 0)
          .sort((a, b) => (b.stats?.completions || 0) - (a.stats?.completions || 0))
          .slice(0, limit);
      },

      // Get user's recommended difficulty based on performance
      getRecommendedDifficulty: () => {
        const { bits } = get();
        if (!bits || bits.length === 0) return 'basic';
        
        const completedBits = bits.filter(bit => bit.stats?.completions > 0);
        if (completedBits.length === 0) return 'basic';
        
        // Calculate average scores by difficulty
        const difficultyStats = ['basic', 'intermediate', 'advanced'].map(difficulty => {
          const bitsOfDifficulty = completedBits.filter(bit => bit.difficulty === difficulty);
          if (bitsOfDifficulty.length === 0) return { difficulty, avgScore: 0, count: 0 };
          
          const totalScore = bitsOfDifficulty.reduce((sum, bit) => sum + (bit.stats?.averageScore || 0), 0);
          return {
            difficulty,
            avgScore: totalScore / bitsOfDifficulty.length,
            count: bitsOfDifficulty.length
          };
        });
        
        // Recommend based on performance
        const basicStats = difficultyStats.find(s => s.difficulty === 'basic');
        const intermediateStats = difficultyStats.find(s => s.difficulty === 'intermediate');
        
        if (basicStats.count === 0) return 'basic';
        if (basicStats.avgScore < 70) return 'basic';
        if (intermediateStats.count === 0 || intermediateStats.avgScore < 70) return 'intermediate';
        return 'advanced';
      },

      // Clear error state
      clearError: () => set({ error: null }),

      // Reset store (useful for logout or testing)
      reset: () => set({
        bits: [],
        groupedBits: { basic: [], intermediate: [], advanced: [] },
        loading: false,
        generating: false,
        error: null
      }),

      // Update bit progress (local only, no API call)
      updateBitProgress: (bitId, level, questionIndex, isCorrect) => {
        set(state => ({
          bits: state.bits.map(bit =>
            bit._id === bitId
              ? {
                  ...bit,
                  userProgress: {
                    ...bit.userProgress,
                    [level]: {
                      ...bit.userProgress[level],
                      answeredQuestions: [
                        ...(bit.userProgress[level]?.answeredQuestions || []),
                        questionIndex
                      ],
                      completed: (
                        bit.userProgress[level]?.answeredQuestions?.length + 1 ===
                        (bit[level]?.questions?.length || 0)
                      )
                    }
                  }
                }
              : bit
          )
        }));
      }
    }),
    { 
      name: "bits-storage",
      // Only persist the bits data, not loading states
      partialize: (state) => ({
        bits: state.bits,
        groupedBits: state.groupedBits
      })
    }
  )
);

export default useBitsStore;

