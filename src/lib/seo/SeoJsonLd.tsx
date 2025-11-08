// lib/seo/SeoJsonLd.tsx
export function SeoJsonLd({ data }: { data: Array<Record<string, any>> }) {
  if (!data?.length) return null;

  return (
    <>
      {data.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
    </>
  );
}
