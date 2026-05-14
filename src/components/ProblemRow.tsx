"use client";

import { useState } from "react";
import { useTrackerStore, ProblemState } from "@/store/useTrackerStore";
import { Check, Flame, Bookmark, ExternalLink, MessageSquare } from "lucide-react";
import { cn } from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";

interface ProblemRowProps {
  problem: {
    id: string;
    title: string;
    link: string;
    difficulty: string;
    platform: string;
  };
}

export function ProblemRow({ problem }: ProblemRowProps) {
  const { problemStates, markStatus, toggleBookmark, toggleImportant, updateNotes } = useTrackerStore();
  const state = problemStates[problem.id] || { status: 'unsolved', notes: '', bookmarked: false, important: false };
  
  const [showNotes, setShowNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState(state.notes);

  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'easy': return 'text-success bg-success/10 border-success/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'hard': return 'text-danger bg-danger/10 border-danger/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const handleStatusChange = () => {
    const nextStatus = state.status === 'unsolved' ? 'solved' : state.status === 'solved' ? 'revising' : 'unsolved';
    markStatus(problem.id, nextStatus as ProblemState['status']);
  };

  const saveNotes = () => {
    updateNotes(problem.id, tempNotes);
    setShowNotes(false);
  };

  return (
    <div className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-colors">
      <div className="p-3 sm:p-4 flex items-center justify-between gap-4">
        
        {/* Left Side: Status & Title */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <button 
            onClick={handleStatusChange}
            className={cn(
              "flex-shrink-0 w-6 h-6 rounded border flex items-center justify-center transition-all",
              state.status === 'solved' ? "bg-success border-success text-white" : 
              state.status === 'revising' ? "bg-warning border-warning text-white" : 
              "border-muted-foreground/30 hover:border-primary text-transparent"
            )}
            title={`Status: ${state.status}`}
          >
            <Check className="w-4 h-4" />
          </button>
          
          <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <a 
              href={problem.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className={cn(
                "font-medium text-sm sm:text-base truncate hover:text-primary hover:underline flex items-center gap-1",
                state.status === 'solved' && "text-muted-foreground line-through opacity-70"
              )}
            >
              {problem.title}
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>
            <div className="flex items-center gap-2">
              <span className={cn("text-[10px] sm:text-xs px-2 py-0.5 rounded-full border", getDifficultyColor(problem.difficulty))}>
                {problem.difficulty}
              </span>
              {problem.platform !== 'Other' && (
                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full border border-border bg-muted/50 text-muted-foreground">
                  {problem.platform}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <button 
            onClick={() => setShowNotes(!showNotes)}
            className={cn("p-1.5 sm:p-2 rounded-md transition-colors", state.notes ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted")}
            title="Notes"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button 
            onClick={() => toggleImportant(problem.id)}
            className={cn("p-1.5 sm:p-2 rounded-md transition-colors", state.important ? "text-orange-500 bg-orange-500/10" : "text-muted-foreground hover:bg-muted")}
            title="Mark Important"
          >
            <Flame className="w-4 h-4" />
          </button>
          <button 
            onClick={() => toggleBookmark(problem.id)}
            className={cn("p-1.5 sm:p-2 rounded-md transition-colors", state.bookmarked ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted")}
            title="Bookmark"
          >
            <Bookmark className={cn("w-4 h-4", state.bookmarked && "fill-current")} />
          </button>
        </div>
      </div>

      {/* Notes Section */}
      <AnimatePresence>
        {showNotes && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border bg-muted/30 px-4 py-3"
          >
            <textarea 
              value={tempNotes}
              onChange={(e) => setTempNotes(e.target.value)}
              placeholder="Add your personal notes, intuitions, or time complexities here..."
              className="w-full h-24 p-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm resize-none"
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button 
                onClick={() => { setTempNotes(state.notes); setShowNotes(false); }}
                className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={saveNotes}
                className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Save Notes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
