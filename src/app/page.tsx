"use client";

import { useTrackerStore } from "@/store/useTrackerStore";
import dsaData from "@/data/dsa-data.json";
import { motion } from "framer-motion";
import { Target, Trophy, Flame, BrainCircuit, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { problemStates } = useTrackerStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalProblems = dsaData.topics.reduce((acc, topic) => acc + topic.problems.length, 0);
  
  const solvedCount = Object.values(problemStates).filter(s => s.status === 'solved').length;
  const revisingCount = Object.values(problemStates).filter(s => s.status === 'revising').length;
  const bookmarkedCount = Object.values(problemStates).filter(s => s.bookmarked).length;

  const progressPercentage = totalProblems === 0 ? 0 : Math.round((solvedCount / totalProblems) * 100);

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 mt-12 lg:mt-0">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back! 👋</h1>
        <p className="text-muted-foreground">Keep up the momentum. You're doing great!</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Solved" 
          value={`${solvedCount} / ${totalProblems}`} 
          icon={Target} 
          color="text-blue-500" 
          bg="bg-blue-500/10" 
        />
        <StatCard 
          title="Completion" 
          value={`${progressPercentage}%`} 
          icon={Trophy} 
          color="text-yellow-500" 
          bg="bg-yellow-500/10" 
        />
        <StatCard 
          title="To Revise" 
          value={revisingCount.toString()} 
          icon={BrainCircuit} 
          color="text-orange-500" 
          bg="bg-orange-500/10" 
        />
        <StatCard 
          title="Bookmarked" 
          value={bookmarkedCount.toString()} 
          icon={Flame} 
          color="text-red-500" 
          bg="bg-red-500/10" 
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-4">Topic Progress</h2>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {dsaData.topics.slice(0, 6).map(topic => {
              const topicTotal = topic.problems.length;
              const topicSolved = topic.problems.filter(p => problemStates[p.id]?.status === 'solved').length;
              const percent = topicTotal === 0 ? 0 : Math.round((topicSolved / topicTotal) * 100);
              
              return (
                <div key={topic.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{topic.title}</span>
                    <span className="text-muted-foreground">{topicSolved}/{topicTotal}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000 ease-out" 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <Link href="/sheet" className="inline-flex items-center text-sm text-primary hover:underline mt-4">
            View all topics <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4"
        >
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Code2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Ready to code?</h2>
          <p className="text-muted-foreground text-sm max-w-sm">
            Jump back into the DSA sheet and tackle the next problem. Consistency is key to mastering Data Structures and Algorithms.
          </p>
          <Link href="/sheet" className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium">
            Continue Practice
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }: { title: string, value: string, icon: any, color: string, bg: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-center space-x-4"
    >
      <div className={`p-3 rounded-lg ${bg}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
}

import { Code2 } from "lucide-react";
