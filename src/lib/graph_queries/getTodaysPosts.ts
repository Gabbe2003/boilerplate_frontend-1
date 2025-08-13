// 'use server';

// const GRAPHQL_URL: string = process.env.WP_GRAPHQL_URL!;
// const WP_TIMEZONE: string = process.env.WP_TIMEZONE || 'Europe/Stockholm'; // adjust if your WP site uses a different tz

// function getTodayBoundsInTZ(tz: string) {
//   const now = new Date();
//   const parts = new Intl.DateTimeFormat('sv-SE', {
//     timeZone: tz,
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//   }).formatToParts(now);

//   const y = parts.find(p => p.type === 'year')!.value;
//   const m = parts.find(p => p.type === 'month')!.value;
//   const d = parts.find(p => p.type === 'day')!.value;

//   const ymd = `${y}-${m}-${d}`;
//   return {
//     after: `${ymd}T00:00:00`,
//     before: `${ymd}T23:59:59`,
//   };
// }

// export async function getTodaysPosts(first: number = 5) {
//   const { after, before } = getTodayBoundsInTZ(WP_TIMEZONE);

//   const query = `
//     query TodaysPosts($after: String!, $before: String!, $first: Int!) {
//       posts(
//         where: {
//           status: PUBLISH
//           dateQuery: { after: $after, before: $before, inclusive: true }
//           orderby: { field: DATE, order: DESC }
//         }
//         first: $first
//       ) {
//         nodes {
//           id
//           databaseId
//           slug
//           uri
//           status
//           title
//           excerpt
//           date
//           commentCount
//           featuredImage {
//             node {
//               id
//               sourceUrl
//               altText
//             }
//           }
//           author {
//             node {
//               id
//               name
//               slug
//             }
//           }
//           categories {
//             nodes {
//               id
//               name
//               slug
//             }
//           }
//           tags {
//             nodes {
//               id
//               name
//               slug
//             }
//           }
//         }
//       }
//     }
//   `;

//   try {
//     const res = await fetch(GRAPHQL_URL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       // short cache since posts change often (1 minute). Tweak as needed.
//       next: { revalidate: 60 },
//       body: JSON.stringify({
//         query,
//         variables: { after, before, first },
//       }),
//     });

//     if (!res.ok) {
//       throw new Error(`Network response was not ok: ${res.status} ${res.statusText}`);
//     }

//     const data = await res.json();

//     if (data.errors?.length) {
//       throw new Error(data.errors.map((e: any) => e.message).join('; '));
//     }

//     return data.data.posts.nodes;
//   } catch (error) {
//     console.error('Error fetching today’s posts:', error);
//     throw new Error('Failed to fetch today’s posts');
//   }
// }
