import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { Achievement } from '../../types';
import { getAchievements, resetAchievements } from '../../lib/achievements';
import {
  Trophy,
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  RotateCcw,
  Zap,
  Star,
  Shield,
  Medal,
} from 'lucide-react';

export const AchievementsApp: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    setAchievements(getAchievements());
  }, []);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const maxPoints = achievements.reduce((sum, a) => sum + a.points, 0);
  const completionPercentage = Math.round((unlockedCount / (totalCount || 1)) * 100);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all portfolio achievements?')) {
      resetAchievements();
      setAchievements(getAchievements());
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden font-sans">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 border-b border-white/10 shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20 ring-2 ring-amber-400/30">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-100 flex items-center gap-2">
              <span>Workstation Achievements & Milestones</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold">
                Level {Math.floor(totalPoints / 100) + 1}
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Interact with features, explore projects, use tools, and discover hidden easter eggs.
            </p>
          </div>
        </div>

        {/* Score & Progress */}
        <div className="flex items-center gap-6 bg-slate-900/80 border border-white/10 px-4 py-2.5 rounded-xl">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Score</span>
            <p className="text-lg font-black text-amber-400 font-mono">
              {totalPoints} <span className="text-xs text-slate-500 font-normal">/ {maxPoints} XP</span>
            </p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Unlocked</span>
            <p className="text-lg font-black text-sky-400 font-mono">
              {unlockedCount} <span className="text-xs text-slate-500 font-normal">/ {totalCount}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-900 overflow-hidden">
        <div
          style={{ width: `${completionPercentage}%` }}
          className="h-full bg-gradient-to-r from-amber-500 to-sky-400 transition-all duration-700"
        />
      </div>

      {/* List of Achievement Cards */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex justify-between items-center pb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              ALL TROPHIES ({unlockedCount} COMPLETED)
            </span>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Trophies</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {achievements.map(ach => (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                  ach.unlocked
                    ? 'bg-slate-900/90 border-amber-500/30 shadow-lg shadow-amber-500/5'
                    : 'bg-slate-900/30 border-white/5 opacity-60'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                    ach.unlocked
                      ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30'
                      : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  {ach.unlocked ? (
                    <span>{ach.icon}</span>
                  ) : (
                    <Lock className="w-5 h-5 text-slate-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`text-xs font-bold truncate ${
                        ach.unlocked ? 'text-slate-100' : 'text-slate-400'
                      }`}
                    >
                      {ach.title}
                    </h3>
                    <span
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        ach.unlocked
                          ? 'bg-amber-400/20 text-amber-300'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      +{ach.points} XP
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {ach.description}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[10px]">
                    <span className="capitalize text-slate-500 font-medium">
                      Category: {ach.category}
                    </span>
                    {ach.unlocked && ach.unlockedAt ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Unlocked {new Date(ach.unlockedAt).toLocaleDateString()}</span>
                      </span>
                    ) : (
                      <span className="text-slate-500">Locked</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
