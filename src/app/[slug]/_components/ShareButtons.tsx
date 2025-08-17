import Email from '@/app/components/icons/email';
import Facebook from '@/app/components/icons/facebook';
import Linkedin from '@/app/components/icons/linkedin';
import Twitter from '@/app/components/icons/twitter';
import { Button } from '@/components/ui/button';

function getShareUrl(
  platform: 'twitter' | 'facebook' | 'linkedin',
  { url, title }: { url: string; title: string },
) {
  switch (platform) {
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    case 'linkedin':
      return `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    default:
      return url;
  }
}

export function ShareButtons({
  postUrl,
  postTitle,
  postExcerpt,
}: {
  postUrl: string;
  postTitle: string;
  postExcerpt: string;
}) {
  return (
<div className="flex items-center justify-center sm:justify-start gap-1 lg:px-3 py-2 border border-neutral-100 rounded-xs">
      {/* Native share/copy */}
      <Button
        variant="ghost"
        className="h-9 min-w-[52px] flex items-start justify-start text-neutral-700 font-medium rounded-xs px--3 cursor-pointer transition-colors duration-150 text-mx border border-transparent hover:bg-neutral-100"
        aria-label="Share Link"
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
            alert('Link Copied!');
          }
        }}
      >
        Share
      </Button>

      {/* Facebook */}
      <Button
        variant="ghost"
        size="iconSmall"
        className="h-9 w-9 flex items-center justify-center p-0 rounded-xs border border-transparent hover:bg-neutral-100 transition-colors"
        asChild
        aria-label="Dela på Facebook"
      >
        <a
          href={getShareUrl('facebook', { url: postUrl, title: postTitle })}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook className="w-5 h-5 text-neutral-500" />
        </a>
      </Button>

      {/* Twitter/X */}
      <Button
        variant="ghost"
        size="iconSmall"
        className="h-9 w-9 flex items-center justify-center p-0 rounded-xs border border-transparent hover:bg-neutral-100 transition-colors"
        asChild
        aria-label="Dela på X"
      >
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
            postUrl,
          )}&text=${encodeURIComponent(`${postTitle}\n\n${postExcerpt}`)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter className="w-5 h-5 text-neutral-500" />
        </a>
      </Button>

      {/* Linkedin */}
      <Button
        variant="ghost"
        size="iconSmall"
        className="h-9 w-9 flex items-center justify-center p-0 rounded-xs border border-transparent hover:bg-neutral-100 transition-colors"
        asChild
        aria-label="Dela på LinkedIn"
      >
        <a
          href={getShareUrl('linkedin', { url: postUrl, title: postTitle })}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin className="w-5 h-5 text-neutral-500" />
        </a>
      </Button>

      {/* Email */}
      <Button
        variant="ghost"
        size="iconSmall"
        className="h-9 w-9 flex items-center justify-center p-0 rounded-xs border border-transparent hover:bg-neutral-100 transition-colors"
        asChild
        aria-label="Dela via e-post"
      >
        <a
          href={`mailto:?subject=${encodeURIComponent(
            postTitle,
          )}&body=${encodeURIComponent(
            `${postTitle}\n\n${postExcerpt}\n\n${postUrl}`,
          )}`}
        >
          <Email className="w-5 h-5 text-neutral-500" />
        </a>
      </Button>
    </div>
  );
}
