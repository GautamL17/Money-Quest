import React, { useEffect, useState } from "react";
import useBitsStore from "../../store/useBitsStore";
import useAuthStore from "../../store/useAuthStore";

// Badge icons, colors, and gradients for each level
const badges = [
  { level: 1, label: "Rookie", icon: "🟢", color: "from-gray-800 to-green-700" },
  { level: 2, label: "Explorer", icon: "🧭", color: "from-gray-800 to-blue-700" },
  { level: 3, label: "Achiever", icon: "🏅", color: "from-gray-800 to-yellow-600" },
  { level: 4, label: "Scholar", icon: "📚", color: "from-gray-800 to-indigo-700" },
  { level: 5, label: "Strategist", icon: "🧠", color: "from-gray-800 to-purple-700" },
  { level: 6, label: "Enthusiast", icon: "🔥", color: "from-gray-800 to-orange-700" },
  { level: 7, label: "Pro", icon: "💎", color: "from-gray-800 to-cyan-700" },
  { level: 8, label: "Master", icon: "🌟", color: "from-gray-800 to-pink-700" },
  { level: 9, label: "Legend", icon: "⚡", color: "from-gray-800 to-red-700" },
  { level: 10, label: "Zenith", icon: "🚀", color: "from-gray-800 to-teal-700" },
];

const getBadge = (level) => badges.find(b => b.level === level) || badges[0];

const StatCard = ({ title, value, icon, gradient }) => (
  <div className={`p-4 rounded-xl shadow-md flex flex-col items-center bg-gradient-to-br ${gradient} hover:scale-105 transition-transform border border-gray-700`}>
    <div className="text-3xl mb-2">{icon}</div>
    <span className="font-semibold text-lg">{title}</span>
    <div className="text-2xl font-semibold
     mt-1">{value}</div>
  </div>
);

const ProgressBar = ({ value, max, gradient }) => (
  <div className="w-full bg-gray-800 rounded-full h-4 mt-2 mb-2 border border-gray-700">
    <div
      className={`h-4 rounded-full transition-all duration-300 bg-gradient-to-r ${gradient}`}
      style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
    />
  </div>
);

const Stats = () => {
  const { bits } = useBitsStore();
  const { user } = useAuthStore();
  const [summary, setSummary] = useState({
    points: 0,
    rank: "Rookie",
    totalBits: 0,
    completedBits: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    accuracy: 0,
    level: 1,
  });

  useEffect(() => {
    let totalBits = bits.length;
    let completedBits = 0;
    let totalQuestions = 0;
    let correctAnswers = 0;

    bits.forEach((bit) => {
      const allLevelsCompleted =
        bit.userProgress?.basic?.completed &&
        bit.userProgress?.intermediate?.completed &&
        bit.userProgress?.advanced?.completed;

      if (allLevelsCompleted) completedBits += 1;

      ["basic", "intermediate", "advanced"].forEach((level) => {
        const levelData = bit.levels?.[level];
        if (levelData?.quiz) {
          totalQuestions += levelData.quiz.length;
          const progress = bit.userProgress?.[level];
          if (progress?.answeredQuestions) {
            correctAnswers += progress.answeredQuestions.length;
          }
        }
      });
    });

    const accuracy =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

    setSummary({
      points: user?.points || 0,
      rank: user?.rank || "Rookie",
      totalBits,
      completedBits,
      totalQuestions,
      correctAnswers,
      accuracy,
      level: user?.level || 1,
    });
  }, [bits, user]);

  const badge = getBadge(summary.level);

  return (
    <div className="max-w-3xl mx-auto p-8 bg-[#141515] rounded-3xl shadow-2xl text-white relative overflow-hidden">
      {/* <div className="absolute top-0 right-0 opacity-10 text-[8rem] pointer-events-none select-none">✨</div> */}
      <h2 className="text-3xl font-semibold mb-6 text-center tracking-tight flex items-center justify-center gap-2">
        {/* <span>{badge.icon}</span> */}
        <span>Your Progress</span>
        {/* <span>{badge.icon}</span> */}
      </h2>
      <div className="flex justify-center mb-6">
        <div className={`bg-gradient-to-br ${badge.color} px-6 py-4 rounded-2xl flex flex-col items-center shadow-lg border-2 border-gray-800`}>
          <div className="text-5xl mb-2">{badge.icon}</div>
          <div className="text-xl font-semibold">{badge.label}</div>
          <div className="text-sm mt-1">Level {summary.level}/10</div>
          {/* <ProgressBar value={summary.level} max={10} gradient={badge.color} /> */}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Points" value={summary.points} icon="💰" gradient="" />
        <StatCard title="Rank" value={summary.rank} icon="🏆" gradient="" />
        <StatCard title="Total Bits" value={summary.totalBits} icon="🧩" gradient="" />
        <StatCard title="Bits Completed" value={summary.completedBits} icon="✅" gradient="" />
        <StatCard title="Questions Attempted" value={summary.totalQuestions} icon="❓" gradient="" />
        <StatCard title="Correct Answers" value={summary.correctAnswers} icon="🎯" gradient="" />
      </div>
      <div className="flex flex-col items-center mb-4">
        <span className="font-semibold text-lg mb-1">Accuracy</span>
        <ProgressBar value={summary.accuracy} max={100} gradient="from-yellow-400 via-orange-500 to-purple-600" />
        <span className="text-2xl font-semibold">{summary.accuracy}%</span>
      </div>
      <div className="flex flex-wrap gap-4 justify-center mt-8">
        {badges.map(b => (
          <div
            key={b.level}
            className={`flex flex-col items-center px-3 py-2 rounded-xl border-2 ${
              summary.level >= b.level
                ? `border-blue-500 bg-gradient-to-br ${b.color}`
                : "border-zinc-700 bg-zinc-900"
            }`}
          >
            <span className="text-2xl">{b.icon}</span>
            <span className="text-xs font-semibold mt-1">{b.label}</span>
            <span className="text-xs">Lv.{b.level}</span>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center text-sm text-zinc-300">
        Keep going! Unlock new badges and level up your financial skills 🚀
      </div>
    </div>
  );
};

export default Stats;
