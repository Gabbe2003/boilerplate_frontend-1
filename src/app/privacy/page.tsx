import type { Metadata } from 'next';
import { getSeo, buildMetadataFromSeo } from '@/lib/seo/seo';

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getSeo('/privacy/');

  if (!payload?.nodeByUri) {
    return {
      title: `Privacy | ${process.env.NEXT_PUBLIC_HOSTNAME}`,
      description: "Read our privacy policy to understand how we collect, use, and protect your information.",
      robots: { index: true, follow: true },
    };
  }

  const meta = buildMetadataFromSeo(payload, {
    metadataBase: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: process.env.NEXT_PUBLIC_SITENAME,
  });

  // fallback description if empty
  if (!meta.description) {
    meta.description = "Read our privacy policy to understand how we collect, use, and protect your information.";
  }

  return meta;
}


const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>

      <section className="space-y-6 text-lg leading-relaxed text-gray-800">
        <p>
          At <strong>{process.env.NEXT_PUBLIC_HOSTNAME}</strong>, your privacy
          is important to us. We are fully committed to protecting your personal
          information and ensuring that your experience with our platform is
          both safe and secure.
        </p>

        <p>
          We only collect the data that is necessary to provide you with the
          best possible experience. This may include your email address for
          newsletter subscriptions or preferences that help tailor our content
          to your interests.
        </p>

        <p>
          You are always in control of your data. If at any point you no longer
          wish to receive our newsletter or communications, you can easily
          unsubscribe with just one click using the link provided in every email
          we send.
        </p>

        <p>
          Our platform uses advanced data protection systems and follows strict
          security protocols to prevent unauthorized access, breaches, or leaks.
          We continuously monitor and update our infrastructure to stay
          compliant with modern standards of information security.
        </p>

        <p>
          We do not sell, rent, or share your personal data with third parties
          without your explicit consent. Your information stays with us, and its
          integrity is our responsibility.
        </p>

        <p>
          By using <strong>{process.env.NEXT_PUBLIC_HOSTNAME}</strong>, you
          agree to the practices described in this privacy policy. We encourage
          you to reach out to us if you have any questions or concerns regarding
          your data or how it is handled.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPage;
