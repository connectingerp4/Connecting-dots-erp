// src/components/ConditionalAuthProvider.js
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from "@/context/AuthContext";

// Pages that need authentication
const AUTH_REQUIRED_PAGES = [
  '/profile',
  '/admin',
  '/blog-admin',
  // Add other protected routes
];

export default function ConditionalAuthProvider({ children }) {
  const pathname = usePathname();
  
  // Check if current page needs authentication
  const needsAuth = AUTH_REQUIRED_PAGES.some(page => 
    pathname?.startsWith(page)
  );

  // If auth is needed, wrap with provider, otherwise return children directly
  if (needsAuth) {
    return (
      <AuthProvider>
        {children}
      </AuthProvider>
    );
  }

  return children;
}
