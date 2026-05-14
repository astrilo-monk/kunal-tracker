"use client";

import { useTrackerStore } from "@/store/useTrackerStore";
import dsaData from "@/data/dsa-data.json";
import { ProblemRow } from "@/components/ProblemRow";
import { Bookmark, Flame } from "lucide-react";
import { useState, useEffect } from "react";

export default function BookmarksPage() {
  const { problemStates } = useTrackerStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const allProblems = dsaData.topics.flatMap(topic => topic.problems);
  
  const bookmarkedProblems = allProblems.filter(p => problemStates[p.id]?.bookmarked);
  const importantProblems = allProblems.filter(p => problemStates[p.id]?.important);

  // Combine and deduplicate just in case, though they serve different lists here
  
  return (
    <div className="space-y-8 mt-12 lg:mt-0 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Saved & Important</h1>
        <p className="text-muted-foreground mt-1">Quick access to problems you want to revisit.</p>
      </div>

      <div className="space-y-6">
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-semibold">Important Problems</h2>
          </div>
          {importantProblems.length === 0 ? (
            <div className="p-8 text-center bg-card border border-border rounded-xl">
              <p className="text-muted-foreground">No important problems marked yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {importantProblems.map(p => <ProblemRow key={p.id} problem={p} />)}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Bookmark className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Bookmarks</h2>
          </div>
          {bookmarkedProblems.length === 0 ? (
            <div className="p-8 text-center bg-card border border-border rounded-xl">
              <p className="text-muted-foreground">No bookmarks added yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {bookmarkedProblems.map(p => <ProblemRow key={p.id} problem={p} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
