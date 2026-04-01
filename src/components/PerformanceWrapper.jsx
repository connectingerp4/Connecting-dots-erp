"use client";

import useOptimizePerformance from "@/hooks/useOptimizePerformance";

export default function PerformanceWrapper({ children }) {
  // Hook safely executes ONLY on client
  useOptimizePerformance();

  return <>{children}</>;
}
