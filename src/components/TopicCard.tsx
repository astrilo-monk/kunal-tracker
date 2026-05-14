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

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden transition-all duration-200">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
            {index}
          </div>
          <div className="text-left">
            <h2 className="text-lg font-semibold">{topic.title}</h2>
            <p className="text-sm text-muted-foreground">{solvedCount} / {totalProblems} Solved</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden md:flex flex-col items-end w-32">
            <span className="text-xs font-medium text-muted-foreground mb-1">{progressPercent}% Completed</span>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out" 
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
            className="border-t border-border bg-muted/20"
          >
            <div className="p-4 space-y-2">
              {topic.problems.map((problem) => (
                <ProblemRow key={problem.id} problem={problem} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
