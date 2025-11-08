"use client";

import { useState, useCallback } from "react";
import PopupModal from "./RulePopUp";

type NewsletterIslandProps = {
  className?: string;
  label?: string;
};

export default function NewsletterIsland({
  className,
  label = "Nyhetsbrev",
}: NewsletterIslandProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = useCallback(() => setIsModalOpen(true), []);
  const handleClose = useCallback(() => setIsModalOpen(false), []);

  return (
    <>
      <button
        className={`${className} cursor-pointer`}
        onClick={handleOpen}
        aria-label="Öppna nyhetsbrevsanmälan"
      >
        {label}
      </button>

      <PopupModal isOpen={isModalOpen} onClose={handleClose} />
    </>
  );
}
