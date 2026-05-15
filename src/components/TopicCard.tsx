"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTrackerStore } from "@/store/useTrackerStore";
import { ProblemRow } from "./ProblemRow";

interface TopicCardProps {
  topic: {
    id: string;
    title: string;
    problems: any[];
  };
  index: number;
}

export function TopicCard({ topic, index }: TopicCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { problemStates } = useTrackerStore();

  const totalProblems = topic.problems.length;
  const solvedCount = topic.problems.filter(p => problemStates[p.id]?.status === 'solved').length;
  const progressPercent = totalProblems === 0 ? 0 : Math.round((solvedCount / totalProblems) * 100);

  const groupedProblems = {
    Videos: [] as any[],
    Easy: [] as any[],
    Medium: [] as any[],
    Hard: [] as any[],
    Uncategorized: [] as any[],
  };

  topic.problems.forEach(p => {
    if (p.difficulty === 'Easy') groupedProblems.Easy.push(p);
    else if (p.difficulty === 'Medium') groupedProblems.Medium.push(p);
    else if (p.difficulty === 'Hard') groupedProblems.Hard.push(p);
    else if (p.link.includes('youtu') || p.title.toLowerCase().includes('video')) groupedProblems.Videos.push(p);
    else groupedProblems.Uncategorized.push(p);
  });

  const renderGroup = (title: string, problems: any[], colorClass: string) => {
    if (problems.length === 0) return null;
    return <ProblemGroup key={title} title={title} problems={problems} colorClass={colorClass} />;
  };

  return (
    <div className="glass rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 group/card">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 dark:hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-gradient-premium shadow-md shadow-primary/20 text-white flex items-center justify-center font-bold text-sm">
            {index}
          </div>
          <div className="text-left">
            <h2 className="text-lg font-semibold">{topic.title}</h2>
            <p className="text-sm text-muted-foreground">{solvedCount} / {totalProblems} Solved</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden md:flex flex-col items-end w-40">
            <span className="text-xs font-medium text-muted-foreground mb-2">{progressPercent}% Completed</span>
            <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-premium shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-700 ease-out" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div className="text-muted-foreground">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border bg-black/5 dark:bg-white/5 backdrop-blur-sm"
          >
            <div className="p-4 sm:p-6">
              {renderGroup("Videos & Resources", groupedProblems.Videos, "text-primary")}
              {renderGroup("Easy", groupedProblems.Easy, "text-success")}
              {renderGroup("Medium", groupedProblems.Medium, "text-warning")}
              {renderGroup("Hard", groupedProblems.Hard, "text-danger")}
              {renderGroup("Other Practices", groupedProblems.Uncategorized, "text-muted-foreground")}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProblemGroup({ title, problems, colorClass }: { title: string, problems: any[], colorClass: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4 last:mb-0 bg-background/50 rounded-lg border border-border/50 overflow-hidden">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className={`text-sm font-semibold tracking-wide uppercase ${colorClass}`}>{title}</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {problems.length} items
          </span>
        </div>
        <div className="text-muted-foreground">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border/50 bg-black/5 dark:bg-white/5"
          >
            <div className="p-3 space-y-2">
              {problems.map((problem) => (
                <ProblemRow key={problem.id} problem={problem} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
