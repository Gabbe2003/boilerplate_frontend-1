"use client";
import { ShareButtons } from "../components/shareButtons";

export default function ShareButtonsClient(props: { postUrl: string; postTitle: string; postExcerpt: string }) {
  return <ShareButtons {...props} />;
}
