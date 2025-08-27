'use client';
import { usePathname } from 'next/navigation';

export default function NotFound({}) {
  const pathname = usePathname();
  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-center font-medium text-xl">
        Den begärda sidan <code>{pathname}</code> finns inte
      </p>
    </div>
  );
}
