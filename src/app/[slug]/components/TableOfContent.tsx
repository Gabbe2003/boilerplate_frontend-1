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

  return (
    <Card className="overflow-hidden gap-2 border-none shadow-none bg-gray-100 rounded-sm">
      <CardHeader className="flex items-center justify-between px-6">
        <nav className="text-lg font-semibold">Table of Content</nav>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(o => !o)}
          className="cursor-pointer"
        >
          {open ? 'Hide' : 'Show'}
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea
          className={`transition-[max-height] duration-300 ease-in-out ${
            open ? 'max-h-80' : 'max-h-0'
          } overflow-hidden`}
        >
          {!!toc.length && (
            <ul className="space-y-2 px-6 list-disc text-black">
              {toc.map(item => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="flex gap-2 text-primary hover:underline"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
