"use client";

import { useTrackerStore } from "@/store/useTrackerStore";
import dsaData from "@/data/dsa-data.json";
import { ProblemRow } from "@/components/ProblemRow";
import { RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";

export default function RevisionPage() {
  const { problemStates } = useTrackerStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const allProblems = dsaData.topics.flatMap(topic => topic.problems);
  
  const revisionProblems = allProblems.filter(p => problemStates[p.id]?.status === 'revising');

  return (
    <div className="space-y-8 mt-12 lg:mt-0 pb-20">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient">Revision Queue</h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">Problems you've marked for revision.</p>
      </div>

      <div className="glass p-4 rounded-lg text-warning-foreground text-sm flex items-start space-x-3">
        <RotateCcw className="w-5 h-5 text-warning flex-shrink-0" />
        <p>Spaced repetition is key to mastering DSA. Make sure to solve these problems entirely on your own without looking at the solution before marking them as solved.</p>
      </div>

      <div>
        {revisionProblems.length === 0 ? (
          <div className="p-12 text-center glass rounded-xl">
            <p className="text-muted-foreground">Your revision queue is empty. Great job!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {revisionProblems.map(p => <ProblemRow key={p.id} problem={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
