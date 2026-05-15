"use client";

import { useState } from "react";
import dsaData from "@/data/dsa-data.json";
import { TopicCard } from "@/components/TopicCard";
import { Search } from "lucide-react";

export default function SheetPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredTopics = dsaData.topics.map(topic => {
    const filteredProblems = topic.problems.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.difficulty.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...topic, problems: filteredProblems };
  }).filter(topic => topic.problems.length > 0);

  return (
    <div className="space-y-6 mt-12 lg:mt-0 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient">DSA Sheet</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">Master Data Structures and Algorithms topic by topic.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search problems..."
            className="w-full pl-10 pr-4 py-2.5 glass rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm shadow-sm transition-all duration-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredTopics.map((topic, index) => (
          <TopicCard key={topic.id} topic={topic} index={index + 1} />
        ))}
        {filteredTopics.length === 0 && (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <p className="text-muted-foreground">No problems found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
