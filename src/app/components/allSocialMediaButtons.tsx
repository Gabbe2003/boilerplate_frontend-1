'use client';

import React from "react";
import { Button } from "@/components/ui/button";

// Use relative paths for icons (assume this file is in components/ and icons/ is a sibling)
import Facebook from "./icons/facebook";
import Instagram from "./icons/instagram";
import Linkedin from "./icons/linkedin";
import Twitter from "./icons/twitter";

// Social media link variables
const facebookUrl = "#";   // e.g. "https://facebook.com/yourpage"
const instagramUrl = "#";  // e.g. "https://instagram.com/yourprofile"
const linkedinUrl = "#";   // e.g. "https://linkedin.com/in/yourprofile"
const xUrl = "#";          // e.g. "https://x.com/yourprofile"

// Array of button definitions for easy editing
const socialButtons = [
  { Icon: Facebook, label: "Facebook", url: facebookUrl },
  { Icon: Instagram, label: "Instagram", url: instagramUrl },
  { Icon: Linkedin, label: "LinkedIn", url: linkedinUrl },
  { Icon: Twitter, label: "X", url: xUrl },
];

const SocialMediaButtons: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`flex flex-row gap-2 justify-center md:justify-end ${className || ""}`}>
    {socialButtons.map(({ Icon, label, url }) => (
      <Button
        key={label}
        variant="ghost"
        size="iconSmall"
        className="h-9 w-9 flex items-center justify-center p-0 rounded-xs border border-transparent hover:bg-neutral-100 transition-colors"
        asChild
        aria-label={label}
      >
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon className="w-5 h-5 text-neutral-500" />
        </a>
      </Button>
    ))}
  </div>
);

export default SocialMediaButtons;
