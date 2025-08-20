import { buildMetadataFromSeo, getSeo } from '@/lib/seo/seo';
import type { Metadata } from 'next';


export async function generateMetadata(): Promise<Metadata> {
  const payload = await getSeo('/about/');

  if (!payload?.nodeByUri) {
    return {
      title: `About | ${process.env.NEXT_PUBLIC_HOSTNAME}`,
      description: "Learn more about us.",
      robots: { index: true, follow: true },
    };
  }

  const meta = buildMetadataFromSeo(payload, {
    metadataBase: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: process.env.NEXT_PUBLIC_SITENAME,
  });

  // fallback description if empty
  if (!meta.description) {
    meta.description = "Learn more about us, our mission, and what we do.";
  }

  return meta;
}

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">About Us</h1>

      <section className="space-y-6 text-lg leading-relaxed text-gray-800">
        <p>
          Welcome to <strong>{process.env.NEXT_PUBLIC_HOSTNAME}</strong>, a
          digital destination for timely, factual, and insightful reporting. Our
          team is driven by a shared passion for delivering high-quality news
          and analysis that keeps our audience informed, engaged, and ahead of
          the curve.
        </p>

        <p>
          We believe in the power of journalism to shape understanding and
          promote clarity in a rapidly evolving world. At{' '}
          <strong>{process.env.NEXT_PUBLIC_HOSTNAME}</strong>, we prioritize
          accuracy, integrity, and relevance in everything we publish—whether
          it’s breaking stories, in-depth reports, or feature coverage.
        </p>

        <p>
          Our mission is straightforward: to be a trusted, comprehensive source
          for the latest news and developments. We explore key issues with depth
          and context, helping our readers navigate today’s fast-paced
          information landscape.
        </p>

        <p>
          Our editorial team is composed of experienced reporters, researchers,
          and editors who bring a broad range of expertise and perspectives to
          our coverage. We closely monitor global events, trends, and stories,
          ensuring that what matters most reaches you without noise or bias.
        </p>

        <p>
          Through clear and engaging storytelling, we aim to make complex topics
          accessible to everyone—from curious readers to seasoned professionals.
          We are committed to providing content that informs decisions, sparks
          conversation, and builds awareness in a connected world.
        </p>

        <p>
          At <strong>{process.env.NEXT_PUBLIC_HOSTNAME}</strong>, we view
          knowledge as empowerment—and we are here to support our readers with
          the information they need to stay informed and confident in their
          understanding of the world around them.
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
