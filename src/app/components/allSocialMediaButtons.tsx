'use client';

import React from "react";
import { Button } from "@/components/ui/button";

// Use relative paths for icons (assume this file is in components/ and icons/ is a sibling)
import Facebook from "./icons/facebook";
import Instagram from "./icons/instagram";
import Linkedin from "./icons/linkedin";
import Pinterest from "./icons/pinterest";
import Slack from "./icons/slack";
import Discord from "./icons/discord";
import Reddit from "./icons/reddit";
import Tumblr from "./icons/tumblr";
import Medium from "./icons/medium";
import VK from "./icons/vkRussian";
import Mastodon from "./icons/mastedon";
import Twitter from "./icons/twitter";

// Social media link variables
const facebookUrl = "#";   // e.g. "https://facebook.com/yourpage"
const instagramUrl = "#";  // e.g. "https://instagram.com/yourprofile"
const linkedinUrl = "#";   // e.g. "https://linkedin.com/in/yourprofile"
const xUrl = "#";          // e.g. "https://x.com/yourprofile"
const pinterestUrl = "#";  // e.g. "https://pinterest.com/yourprofile"
const slackUrl = "#";      // e.g. "https://yourworkspace.slack.com"
const discordUrl = "#";    // e.g. "https://discord.com/invite/yourserver"
const redditUrl = "#";     // e.g. "https://reddit.com/u/yourprofile"
const vkUrl = "#";         // e.g. "https://vk.com/yourprofile"
const tumblrUrl = "#";     // e.g. "https://tumblr.com/yourprofile"
const mastodonUrl = "#";   // e.g. "https://mastodon.social/@yourusername"
const mediumUrl = "#";     // e.g. "https://medium.com/@yourprofile"

// Array of button definitions for easy editing
const socialButtons = [
  { Icon: Facebook, label: "Facebook", url: facebookUrl },
  { Icon: Instagram, label: "Instagram", url: instagramUrl },
  { Icon: Linkedin, label: "LinkedIn", url: linkedinUrl },
  { Icon: Twitter, label: "X", url: xUrl },
  { Icon: Pinterest, label: "Pinterest", url: pinterestUrl },
  { Icon: Slack, label: "Slack", url: slackUrl },
  { Icon: Discord, label: "Discord", url: discordUrl },
  { Icon: Reddit, label: "Reddit", url: redditUrl },
  { Icon: VK, label: "VK", url: vkUrl },
  { Icon: Tumblr, label: "Tumblr", url: tumblrUrl },
  { Icon: Mastodon, label: "Mastodon", url: mastodonUrl },
  { Icon: Medium, label: "Medium", url: mediumUrl },
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
