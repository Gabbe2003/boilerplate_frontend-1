'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ITOCItem } from '@/lib/types';
import Link from 'next/link';

export function TocCard({ toc }: { toc: ITOCItem[] }) {
  const [open, setOpen] = useState(true); 

  return (
    <Card className="mt-2 overflow-hidden shadow-none rounded-sm">
      <CardHeader className="flex items-center justify-between px-6">
        <nav className="text-lg font-semibold">Innehållsförteckning</nav>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen((o) => !o)}
          className="cursor-pointer"
        >
          {open ? 'Dölj' : 'Visa'}
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
              {toc.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`#${item.id}`}
                    className="flex gap-2 text-primary hover:underline"
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
