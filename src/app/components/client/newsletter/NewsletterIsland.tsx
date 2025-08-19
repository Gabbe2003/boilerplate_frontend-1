"use client";


import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import PopupModal from "./Rule_sub";


type NewsletterIslandProps = {
className: string; // pass the exact button classes to preserve style
label?: string; // default: "Newsletter"
};


export default function NewsletterIsland({ className, label = "Newsletter" }: NewsletterIslandProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpen = useCallback(() => setIsModalOpen(true), []);
  const handleClose = useCallback(() => setIsModalOpen(false), []);


  return (
    <>
      <Button
        type="button"
        variant="link"
        className={className}
        onClick={handleOpen}
        aria-label="Open newsletter signup"
      >
      {label}
      </Button>
      <PopupModal isOpen={isModalOpen} onClose={handleClose} />
    </>
  );
}