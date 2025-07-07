'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TocCard({ toc }: { toc: TocItem[] }) {
  const [open, setOpen] = useState(true);

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <Card className="overflow-hidden gap-2 border-none shadow-none bg-gray-100">
      <CardHeader className="flex items-center justify-between px-6">
        <h2 className="text-lg font-semibold">Table of Content</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen((o) => !o)}
          className="cursor-pointer"
        >
          {open ? 'Hide' : 'Show'}
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <div
          className={`origin-top transform transition-all duration-500 ease-in-out ${
            open
              ? 'scale-y-100 opacity-100 max-h-80'
              : 'scale-y-0 opacity-0 max-h-0'
          }`}
        >
          <ScrollArea className="max-h-80 overflow-y-auto">
            <ul className="space-y-2 px-6 list-disc text-black">
              {toc.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={handleClick(item.id)}
                    className="flex gap-2 text-left text-primary hover:underline w-full"
                  >
                    {item.text}
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
