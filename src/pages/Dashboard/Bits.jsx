import { useEffect, useState } from "react";
import useBitsStore from "../../store/useBitsStore";
import {Link, NavLink} from 'react-router-dom';
const Bits = () => {
  const {
    bits,
    loading,
    generating,
    error,
    fetchBits,
    generateAllLevels,
    clearError
  } = useBitsStore();

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentLevel, setCurrentLevel] = useState('basic');
  const [userStats, setUserStats] = useState({ points: 0, rank: "Rookie" });
  const [expandedBitId, setExpandedBitId] = useState(null);

  // Fetch bits on mount
  useEffect(() => {
    fetchBits();
  }, []);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Fetch user stats on mount
  useEffect(() => {
    async function fetchUserStats() {
      const res = await fetch('http://localhost:8000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setUserStats({ points: data.points, rank: data.rank });
    }
    fetchUserStats();
  }, []);

  // Generate complete learning path (all 3 levels)
  const handleGenerateAll = async () => {
    const title = prompt("Enter a topic to create a complete learning path (Basic → Intermediate → Advanced):");
    if (!title) return;

    const category = prompt("Enter category (budgeting/saving/investing/credit/debit/general):", "general");

    try {
      await generateAllLevels(title, { category });
    } catch (error) {
      console.error("Failed to generate learning path:", error);
    }
  };

  // Get updateProgress from the store
  const updateProgress = useBitsStore(state => state.updateProgress);

  // Handle quiz answers with progress tracking
  const handleAnswer = async (bitId, level, qIndex, option, correct, explanations) => {
    const isCorrect = option === correct;
    const answerId = `${bitId}-${level}-${qIndex}`;

    setSelectedAnswers(prev => ({
      ...prev,
      [answerId]: {
        result: isCorrect ? "✅ Correct!" : "❌ Wrong",
        explanation: explanations?.[option] || "No explanation available.",
        isCorrect,
        selected: option
      },
    }));

    try {
      await updateProgress(bitId, level, qIndex, isCorrect);
      setExpandedBitId(bitId);
      await fetchUserStats(); // <-- Re-fetch points after progress update
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };


  // Calculate completion for a specific level
  const getLevelCompletion = (bit, level) => {
    const answered = bit.userProgress?.[level]?.answeredQuestions?.length || 0;
    return answered;
  };

  // Check if level is unlocked
  const isLevelUnlocked = (bit, level) => {
    if (level === 'basic') return true; // Basic is always unlocked
    if (level === 'intermediate') return bit.userProgress?.basic?.completed || false;
    if (level === 'advanced') return bit.userProgress?.intermediate?.completed || false;
    return false;
  };

  // Check if level is completed
  const isLevelCompleted = (bit, level) => {
    return bit.userProgress?.[level]?.completed || false;
  };

  // Get level badge styling
  const getLevelBadge = (level, isUnlocked, isCompleted) => {
    if (isCompleted) {
      return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
        ✅ {level.charAt(0).toUpperCase() + level.slice(1)} - Completed
      </span>;
    }

    if (!isUnlocked) {
      return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
        🔒 {level.charAt(0).toUpperCase() + level.slice(1)} - Locked
      </span>;
    }

    const colors = {
      basic: 'bg-green-500/20 text-green-300 border-green-500/30',
      intermediate: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      advanced: 'bg-red-500/20 text-red-300 border-red-500/30'
    };

    return <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[level]}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)} - Available
    </span>;
  };

  // Render a single level
  const renderLevel = (bit, level, levelData) => {
    const isUnlocked = isLevelUnlocked(bit, level);
    const isCompleted = isLevelCompleted(bit, level);
    const questionsAnswered = getLevelCompletion(bit, level);
    const completionPercentage = (questionsAnswered / 5) * 100;

    if (!isUnlocked) {
      return (
        <div key={level} className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-600">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-400">
              {level.charAt(0).toUpperCase() + level.slice(1)} Level
            </h4>
            {getLevelBadge(level, isUnlocked, isCompleted)}
          </div>
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🔒</div>
            <p className="text-gray-400">Complete the previous level to unlock</p>
          </div>
        </div>
      );
    }

    return (
      <div key={level} className={`bg-zinc-800/50 p-6 rounded-lg border ${isCompleted ? 'border-green-500/30' : 'border-zinc-600'}`}>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white">
            {level.charAt(0).toUpperCase() + level.slice(1)} Level
          </h4>
          <div className="flex items-center gap-3">
            {getLevelBadge(level, isUnlocked, isCompleted)}
            <div className="text-sm text-gray-400">
              {questionsAnswered}/5 questions
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full transition-all duration-300 ${isCompleted ? 'bg-green-500' : 'bg-blue-500'
              }`}
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>

        {/* Content */}
        <p className="text-gray-300 mb-6 leading-relaxed">{levelData.content}</p>

        {/* Quiz */}
        <div className="space-y-4">
          <h5 className="text-md font-semibold text-white">
            📝 Quiz ({levelData.quiz?.length || 0} questions)
          </h5>

          {levelData.quiz?.map((q, idx) => (
            <div key={idx} className="bg-zinc-900/50 p-4 rounded-lg">
              <p className="font-medium text-gray-200 mb-3">
                {idx + 1}. {q.question}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options?.map((opt, i) => {
                  const answerId = `${bit._id}-${level}-${idx}`;
                  const userAnswer = selectedAnswers[answerId];
                  const isSelected = userAnswer && userAnswer.isCorrect === false && userAnswer.selected === opt;

                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(bit._id, level, idx, opt, q.answer, q.explanations)}
                      disabled={!!userAnswer}
                      className={`px-4 py-3 rounded-md text-left transition-colors ${
                        userAnswer
                          ? opt === q.answer
                            ? 'bg-green-600/30 text-green-300 border border-green-500'
                            : isSelected
                              ? 'bg-red-600/30 text-red-300 border border-red-500'
                              : 'bg-zinc-700 text-gray-400'
                          : 'bg-zinc-700 text-gray-200 hover:bg-zinc-600'
                      } disabled:cursor-not-allowed`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {selectedAnswers[`${bit._id}-${level}-${idx}`] && (
                <div className="mt-4 p-3 rounded-md bg-zinc-900/50 border-l-4 border-blue-400">
                  <p className="text-sm font-medium mb-1">
                    {selectedAnswers[`${bit._id}-${level}-${idx}`].result}
                  </p>
                  <p className="text-sm text-gray-300">
                    {selectedAnswers[`${bit._id}-${level}-${idx}`].explanation}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Level completion message */}
          {isCompleted && (
            <div className="mt-6 p-4 bg-green-600/20 border border-green-500 rounded-lg text-center">
              <p className="text-green-300 font-medium">
                🎉 {level.charAt(0).toUpperCase() + level.slice(1)} level completed!
              </p>
              {level === 'basic' && (
                <p className="text-blue-400 text-sm mt-1">Intermediate level unlocked! 🚀</p>
              )}
              {level === 'intermediate' && (
                <p className="text-purple-400 text-sm mt-1">Advanced level unlocked! 🌟</p>
              )}
              {level === 'advanced' && (
                <p className="text-gold-400 text-sm mt-1">Congratulations! You've mastered this topic! 👑</p>
              )}
            </div>
          )}
          {questionsAnswered === 5 && !isCompleted && (
            <div className="mt-6 p-4 bg-blue-600/20 border border-blue-500 rounded-lg text-center">
              <p className="text-blue-300 font-medium">
                🎯 All questions answered! Keep going to master this level!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">💡 Financial Learning Paths</h1>
          <p className="text-gray-400 mt-1">Master topics progressively: Basic → Intermediate → Advanced</p>
        </div>
        <button
          onClick={handleGenerateAll}
          disabled={generating}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-md hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          {generating ? "Creating Learning Path..." : "🚀 Create Learning Path"}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-lg">
          <p>{error}</p>
          <button onClick={clearError} className="text-red-400 hover:text-red-300 text-sm mt-2">
            ✕ Dismiss
          </button>
        </div>
      )}

      {/* User Stats */}
      <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-600">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white">Your Progress</h4>
          <div className="text-sm text-gray-400">
            Rank: <span className="font-medium text-white">{userStats.rank}</span>
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="flex-1 p-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
            <div className="text-xs text-gray-400 mb-1">Points</div>
            <div className="text-xl font-bold text-white">
              {userStats.points}
            </div>
          </div>

          <div className="flex-1 p-3 rounded-lg bg-gradient-to-r from-green-500/20 to-yellow-500/20">
            <div className="text-xs text-gray-400 mb-1">Mastered Topics</div>
            <div className="text-xl font-bold text-white">
              {bits.filter(bit => isLevelCompleted(bit, 'advanced')).length}
            </div>
          </div>
        </div>

        <div className="text-center">
            <NavLink to='/dashboard/stats' className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-all duration-200">
              View Detailed Stats
            </NavLink>
        </div>
      </div>

      {/* Level Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-zinc-800/50 rounded-lg">
        {['basic', 'intermediate', 'advanced'].map(level => (
          <button
            key={level}
            onClick={() => setCurrentLevel(level)}
            className={`px-4 py-2 rounded-md transition-colors font-medium ${currentLevel === level
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-300 hover:bg-zinc-700'}`}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading learning paths...</p>
        </div>
      ) : bits.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Learning Paths Yet</h3>
          <p className="text-gray-400 text-lg mb-4">Create your first complete learning path!</p>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Each learning path contains 15 questions across 3 difficulty levels.
            Complete Basic level to unlock Intermediate, then Advanced.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {bits.map((bit) => {
            const levelsCompleted = ['basic', 'intermediate', 'advanced'].filter(level =>
              isLevelCompleted(bit, level)
            ).length;
            const overallProgress = ['basic', 'intermediate', 'advanced'].reduce((acc, level) => {
              const completion = getLevelCompletion(bit, level);
              return acc + completion;
            }, 0);
            const overallPercentage = (overallProgress / 15) * 100;

            return (
              <div
                key={bit._id}
                className="bg-[#141515] p-6 rounded-xl shadow-lg border border-zinc-700 hover:border-zinc-600 transition-all duration-200 cursor-pointer"
                onClick={() => setExpandedBitId(expandedBitId === bit._id ? null : bit._id)}
              >
                {/* Summary */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-400 mb-2">{bit.title}</h2>
                    <div className="flex items-center gap-4 mb-1">
                      <span className="text-sm text-gray-400 bg-zinc-800 px-3 py-1 rounded">
                        {bit.category?.charAt(0).toUpperCase() + bit.category?.slice(1)}
                      </span>
                      <span className="text-sm text-gray-400">
                        {levelsCompleted}/3 levels completed
                      </span>
                      <span className="text-sm text-gray-400">
                        {overallProgress}/15 questions answered
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Created: {new Date(bit.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-semibold text-white mb-1">
                      {Math.round(overallPercentage)}%
                    </div>
                    <div className="w-24 h-3 bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-300"
                        style={{ width: `${overallPercentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Overall Progress
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {expandedBitId === bit._id && (
                  <div className="mt-4 space-y-6">
                    {['basic', 'intermediate', 'advanced'].map(level =>
                      bit.levels && bit.levels[level] ? renderLevel(bit, level, bit.levels[level]) : null
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


export default Bits;