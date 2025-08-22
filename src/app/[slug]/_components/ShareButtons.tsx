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
    <div className="flex items-center justify-start gap-1 py-2 border border-neutral-100 rounded-xs">
      {/* Native share/copy */}
      <Button
        variant="ghost"
        className="h-9 min-w-[52px] flex items-center justify-center text-neutral-700 font-medium rounded-xs cursor-pointer transition-colors duration-150 border border-transparent hover:bg-neutral-100"
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
      >
        <a
          href={getShareUrl('facebook', { url: postUrl, title: postTitle })}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
        >
          <Facebook className="w-5 h-5 text-neutral-500" aria-hidden="true" />
          <span className="sr-only">Share on Facebook</span>
        </a>
      </Button>

      {/* Twitter/X */}
      <Button
        variant="ghost"
        size="iconSmall"
        className="h-9 w-9 flex items-center justify-center p-0 rounded-xs border border-transparent hover:bg-neutral-100 transition-colors"
        asChild
      >
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
            postUrl
          )}&text=${encodeURIComponent(`${postTitle}\n\n${postExcerpt}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
        >
          <Twitter className="w-5 h-5 text-neutral-500" aria-hidden="true" />
          <span className="sr-only">Share on X</span>
        </a>
      </Button>

      {/* LinkedIn */}
      <Button
        variant="ghost"
        size="iconSmall"
        className="h-9 w-9 flex items-center justify-center p-0 rounded-xs border border-transparent hover:bg-neutral-100 transition-colors"
        asChild
      >
        <a
          href={getShareUrl('linkedin', { url: postUrl, title: postTitle })}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="w-5 h-5 text-neutral-500" aria-hidden="true" />
          <span className="sr-only">Share on LinkedIn</span>
        </a>
      </Button>

      {/* Email */}
      <Button
        variant="ghost"
        size="iconSmall"
        className="h-9 w-9 flex items-center justify-center p-0 rounded-xs border border-transparent hover:bg-neutral-100 transition-colors"
        asChild
      >
        <a
          href={`mailto:?subject=${encodeURIComponent(
            postTitle
          )}&body=${encodeURIComponent(
            `${postTitle}\n\n${postExcerpt}\n\n${postUrl}`
          )}`}
          aria-label="Share via email"
        >
          <Email className="w-5 h-5 text-neutral-500" aria-hidden="true" />
          <span className="sr-only">Share via email</span>
        </a>
      </Button>
    </div>
  );
}
