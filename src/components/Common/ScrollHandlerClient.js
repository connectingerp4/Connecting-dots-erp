'use client';

import dynamic from 'next/dynamic';

// Client-side only ScrollHandler with dynamic import
const ScrollHandler = dynamic(
  () => import('./ScrollHandler'),
  { ssr: false }
);

// This is a client component wrapper that handles the dynamic import
export default function ScrollHandlerClient() {
  return <ScrollHandler />;
}
