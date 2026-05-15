"use client";

import { useCloudSync } from "@/hooks/useCloudSync";

export function SyncManager() {
  useCloudSync();
  return null;
}
