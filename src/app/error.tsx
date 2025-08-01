// src/app/error.tsx
'use client';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="p-6 " style={{ height: '100vh' }}>
      <h2>Something went wrong</h2>
      <pre className="text-wrap">{error.message}</pre>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
