// app/page.tsx
import React from 'react';
import PostsList from './components/Main-page/PostsList';
import PopularPosts from './components/Popular/PopularPosts';
// import AdPopup from './components/ads/adsPopup';
import CatsPage from './[slug]/_components/categoryWrapper';
import TradingViewScreener from './components/tickers/TradingViewScreener';
import FinanstidningSeoText from './seoTextMainPage';

import {
  getLatestPostSeo,
  getSeoSettings,
  getUsersSeo,
  getSitemapSettings,
  getRedirections,
} from '@/lib/graph_queries/seo/generalSettings';
import HomePageSEO from '@/lib/graph_queries/seo/homePage';

export default async function Page() {
  // Site-wide settings (for base URL, language, timezone, etc.)
  const settings = await getSeoSettings();

  // Latest post with Rank Math SEO via WPGraphQL
  const latest = await getLatestPostSeo();
  const latestSeo = latest?.seo;

  // Users with Rank Math SEO via WPGraphQL
  const users = await getUsersSeo();

  // Rank Math Sitemap settings
  const sitemap = await getSitemapSettings();

  // Rank Math Redirections
  const redirs = await getRedirections();

  // Optional: server logs
  console.log('Site settings:', settings);
  console.log('Latest post SEO:', latest);
  console.log('Users SEO:', users);
  console.log('Sitemap settings:', sitemap);
  console.log('Redirections:', redirs);

  return (
    <>
      
      
            <HomePageSEO />
      
      
      
      
      {/* Latest post SEO (debug/visual render) */}
      <section style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
        <h2>Latest Post (GraphQL + Rank Math)</h2>
        <dl style={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: '0.5rem' }}>
          <dt>DB ID</dt>
          <dd>{latest?.databaseId ?? '—'}</dd>

          <dt>WP Title</dt>
          <dd>{latest?.title ?? '—'}</dd>

          <dt>SEO Title</dt>
          <dd>{latestSeo?.title ?? '—'}</dd>

          <dt>SEO Description</dt>
          <dd>{latestSeo?.description ?? '—'}</dd>

          <dt>Canonical URL</dt>
          <dd>{latestSeo?.canonicalUrl ?? '—'}</dd>

          <dt>Robots</dt>
          <dd>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {typeof latestSeo?.robots === 'object'
                ? JSON.stringify(latestSeo?.robots, null, 2)
                : String(latestSeo?.robots ?? '—')}
            </pre>
          </dd>

          <dt>Focus Keywords</dt>
          <dd>
            {Array.isArray(latestSeo?.focusKeywords)
              ? latestSeo?.focusKeywords.join(', ')
              : (latestSeo?.focusKeywords ?? '—')}
          </dd>

          <dt>Breadcrumbs</dt>
          <dd>
            {latestSeo?.breadcrumbs?.length ? (
              <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                {latestSeo.breadcrumbs.map((b, i) => (
                  <li key={i}>
                    {b.text} — {b.url} {b.isHidden ? '(hidden)' : ''}
                  </li>
                ))}
              </ul>
            ) : '—'}
          </dd>

          <dt>OpenGraph</dt>
          <dd>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {latestSeo?.openGraph ? JSON.stringify(latestSeo.openGraph, null, 2) : '—'}
            </pre>
          </dd>

          <dt>JSON-LD</dt>
          <dd>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {latestSeo?.jsonLd?.raw ? latestSeo.jsonLd.raw : '—'}
            </pre>
          </dd>
        </dl>
      </section>

      {/* Users SEO (debug/visual render) */}
      <section style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
        <h2>Users (GraphQL + Rank Math)</h2>

        {users?.length ? (
          <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0, display: 'grid', gap: '1rem' }}>
            {users.map((u, idx) => {
              const useo = u.seo;
              return (
                <li key={idx} style={{ border: '1px solid #eee', borderRadius: 6, padding: '1rem' }}>
                  <h3 style={{ marginTop: 0 }}>{u.name ?? '—'}</h3>
                  <dl style={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: '0.5rem' }}>
                    <dt>SEO Title</dt>
                    <dd>{useo?.title ?? '—'}</dd>

                    <dt>SEO Description</dt>
                    <dd>{useo?.description ?? '—'}</dd>

                    <dt>Canonical URL</dt>
                    <dd>{useo?.canonicalUrl ?? '—'}</dd>

                    <dt>Robots</dt>
                    <dd>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                        {typeof useo?.robots === 'object'
                          ? JSON.stringify(useo?.robots, null, 2)
                          : String(useo?.robots ?? '—')}
                      </pre>
                    </dd>

                    <dt>Focus Keywords</dt>
                    <dd>
                      {Array.isArray(useo?.focusKeywords)
                        ? useo?.focusKeywords.join(', ')
                        : (useo?.focusKeywords ?? '—')}
                    </dd>

                    <dt>Breadcrumbs</dt>
                    <dd>
                      {useo?.breadcrumbs?.length ? (
                        <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                          {useo.breadcrumbs.map((b, i) => (
                            <li key={i}>
                              {b?.url} {b?.isHidden ? '(hidden)' : ''}
                            </li>
                          ))}
                        </ul>
                      ) : '—'}
                    </dd>

                    <dt>Full Head</dt>
                    <dd>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                        {useo?.fullHead ?? '—'}
                      </pre>
                    </dd>

                    <dt>JSON-LD</dt>
                    <dd>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                        {useo?.jsonLd?.raw ?? '—'}
                      </pre>
                    </dd>
                  </dl>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>—</p>
        )}
      </section>

      {/* Sitemap Settings (debug/visual render) */}
      <section style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
        <h2>Sitemap Settings (GraphQL + Rank Math)</h2>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
          {sitemap ? JSON.stringify(sitemap, null, 2) : '—'}
        </pre>
      </section>

      {/* Rank Math Redirections (debug/visual render) */}
      <section style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
        <h2>Redirections (GraphQL + Rank Math)</h2>

        {redirs?.length ? (
          <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0, display: 'grid', gap: '1rem' }}>
            {redirs.map((r) => (
              <li key={r.id} style={{ border: '1px solid #eee', borderRadius: 6, padding: '1rem' }}>
                <dl style={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: '0.5rem' }}>
                  <dt>DB ID</dt>
                  <dd>{r.databaseId ?? '—'}</dd>

                  <dt>Status</dt>
                  <dd>{r.status ?? '—'}</dd>

                  <dt>Type</dt>
                  <dd>{r.type ?? '—'}</dd>

                  <dt>Redirect To</dt>
                  <dd>{r.redirectToUrl ?? '—'}</dd>

                  <dt>Hits</dt>
                  <dd>{r.hits ?? 0}</dd>

                  <dt>Created</dt>
                  <dd>{r.dateCreated ?? '—'} (GMT: {r.dateCreatedGmt ?? '—'})</dd>

                  <dt>Modified</dt>
                  <dd>{r.dateModified ?? '—'} (GMT: {r.dateModifiedGmt ?? '—'})</dd>

                  <dt>Last Accessed</dt>
                  <dd>{r.dateLastAccessed ?? '—'} (GMT: {r.dateLastAccessedGmt ?? '—'})</dd>

                  <dt>Sources</dt>
                  <dd>
                    {r.sources?.length ? (
                      <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                        {r.sources.map((s, i) => (
                          <li key={i}>
                            <code>{s.pattern ?? '—'}</code> [{s.comparison ?? '—'}]
                            {s.ignore ? ' (ignore case)' : ''}
                          </li>
                        ))}
                      </ul>
                    ) : '—'}
                  </dd>
                </dl>
              </li>
            ))}
          </ul>
        ) : (
          <p>—</p>
        )}
      </section>

      {/* Your existing homepage content */}
      <PopularPosts />
      <TradingViewScreener />
      <CatsPage />
      <PostsList />
      <FinanstidningSeoText />
      {/* <AdPopup /> */}
      
    </>
  );
}