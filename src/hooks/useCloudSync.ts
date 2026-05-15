import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useTrackerStore } from "@/store/useTrackerStore";

export function useCloudSync() {
  const { data: session, status } = useSession();
  const { problemStates, setCloudState, setSyncStatus, lastSyncedAt } = useTrackerStore();
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevProblemStatesRef = useRef(problemStates);

  const performSync = async () => {
    if (status !== "authenticated") return;

    try {
      setSyncStatus(true);
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemStates }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.mergedStates) {
          // Update local state with merged cloud data
          setCloudState(data.mergedStates, data.syncTime);
          prevProblemStatesRef.current = data.mergedStates; // Prevent loop
        }
      } else {
        console.error("Sync failed:", await res.text());
      }
    } catch (err) {
      console.error("Network error during sync", err);
    } finally {
      setSyncStatus(false);
    }
  };

  // Sync on login
  useEffect(() => {
    if (status === "authenticated" && lastSyncedAt === null) {
      performSync();
    }
  }, [status]);

  // Debounced sync on state changes
  useEffect(() => {
    if (status !== "authenticated") return;

    // Only sync if actual content changed (not just hydration or cloud update)
    if (prevProblemStatesRef.current !== problemStates) {
      prevProblemStatesRef.current = problemStates;
      
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      syncTimeoutRef.current = setTimeout(() => {
        performSync();
      }, 3000); // Debounce sync by 3 seconds
    }

    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [problemStates, status]);

  return { performSync };
}
