"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, List, Bookmark, RotateCcw, Settings, Menu, X, Code2 } from "lucide-react";
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "DSA Sheet", href: "/sheet", icon: List },
  { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { name: "Revision", href: "/revision", icon: RotateCcw },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-card border border-border rounded-md shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
      </button>

      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 glass border-r border-border shadow-sm flex flex-col transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-premium shadow-md shadow-primary/20 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Kunal Tracker</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden",
                  isActive 
                    ? "text-primary font-medium bg-primary/10" 
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground hover:translate-x-1"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md" />
                )}
                <item.icon className={cn("w-5 h-5 relative z-10 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-xs text-muted-foreground">Logged in as</p>
            <p className="font-medium text-sm truncate">Anonymous User</p>
          </div>
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
