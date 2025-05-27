"use client";

import React from 'react';

// For Zustand, a direct provider isn't strictly necessary unless you want to
// handle initial state hydration from server components or other specific scenarios.
// For this setup, useAppStore can be imported directly into components.
// This AppProvider is kept simple as a pass-through for now, as it's referenced in RootLayout.
// It could be enhanced for more complex hydration or context provision if needed.

export default function AppProvider({ children }: { children: React.ReactNode }) {
  // Here you could initialize parts of the store if needed, e.g., from server props
  // or ensure certain actions are taken on load.
  return <>{children}</>;
}