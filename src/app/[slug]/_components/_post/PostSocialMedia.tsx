"use client"
import { Facebook, Mail, Linkedin, Twitter } from 'lucide-react';

function getShareUrl(
  platform: 'twitter' | 'facebook' | 'linkedin',
  { url, title }: { url: string; title: string },
) {
  switch (platform) {
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    case 'linkedin':
      return `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        url
      )}&title=${encodeURIComponent(title)}`;
    default:
      return url;
  }
}

export default function PostSocialMedia({
  postUrl,
  postTitle,
  postExcerpt,
}: {
  postUrl: string;
  postTitle: string;
  postExcerpt: string;
}) {
  return (
    <div className="flex items-center justify-start gap-1 py-2  rounded-xs  ">
      {/* Native share/copy */}
      <button
        className="h-9 flex items-center p-0 sm:p-2 justify-center text-neutral-700 font-medium rounded-xs cursor-pointer transition-colors duration-150 border border-transparent hover:bg-neutral-100"
        onClick={async () => {
          if (typeof window !== 'undefined' && navigator.share) {
            try {
              await navigator.share({
                title: postTitle,
                text: postExcerpt || postTitle,
                url: postUrl,
              });
            } catch (e) {
              console.log('User cancelled and sharing failed', e);
            }
          } else if (typeof window !== 'undefined' && navigator.clipboard) {
            await navigator.clipboard.writeText(postUrl);
            alert('Länk kopierad!');
          }
        }}
      >
        Dela
      </button>

      {/* Facebook */}
      <button
        className="h-9 w-9 flex items-center justify-center p-0 rounded-xs border border-transparent hover:bg-neutral-100 transition-colors"
      >
        <a
          href={getShareUrl('facebook', { url: postUrl, title: postTitle })}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Dela på Facebook"
        >
          <Facebook className="w-5 h-5 text-neutral-500" aria-hidden="true" />
          <span className="sr-only">Dela på Facebook</span>
        </a>
      </button>

      {/* Twitter/X */}
      <button
        className="h-9 w-9 flex items-center justify-center p-0 rounded-xs border border-transparent hover:bg-neutral-100 transition-colors"
      >
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
            postUrl
          )}&text=${encodeURIComponent(`${postTitle}\n\n${postExcerpt}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Dela på X"
        >
          <Twitter className="w-5 h-5 text-neutral-500" aria-hidden="true" />
          <span className="sr-only">Dela på X</span>
        </a>
      </button>

      {/* LinkedIn */}
      <button
        className="h-9 w-9 flex items-center justify-center p-0 rounded-xs border border-transparent hover:bg-neutral-100 transition-colors"
        
      >
        <a
          href={getShareUrl('linkedin', { url: postUrl, title: postTitle })}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Dela på LinkedIn"
        >
          <Linkedin className="w-5 h-5 text-neutral-500" aria-hidden="true" />
          <span className="sr-only">Dela på LinkedIn</span>
        </a>
      </button>

      {/* Email */}
      <button
        className="h-9 w-9 flex items-center justify-center p-0 rounded-xs border border-transparent hover:bg-neutral-100 transition-colors"
      >
        <a
          href={`mailto:?subject=${encodeURIComponent(
            postTitle
          )}&body=${encodeURIComponent(
            `${postTitle}\n\n${postExcerpt}\n\n${postUrl}`
          )}`}
          aria-label="Dela via e-post"
        >
          <Mail className="w-5 h-5 text-neutral-500" aria-hidden="true" />
          <span className="sr-only">Dela via e-post</span>
        </a>
      </button>
    </div>
  );
}
