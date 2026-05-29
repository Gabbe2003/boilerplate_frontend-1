export type AdSection = "header" | "scroll" | "popup";

export type LinkedPost = {
  id?: number;
  title?: string;
  excerpt?: string;
  link?: string;
  image?: string;
  image_srcset?: string;
} | null;

export interface Ad {
  id: number;
  section: AdSection;
  use_custom: boolean;
  annons: boolean;
  target_blank: boolean;
  title: string;
  description: string;
  text: string;
  cta: string;
  button: string;
  link: string;
  image: string;
  image_srcset: string;
  image_id: number | null;
  bg_color: string;
  button_bg_color: string;
  linked_post: LinkedPost;
}

export interface AdsResponse {
  section: AdSection;
  display_mode: string;
  count: number;
  ads: Ad[];
}
