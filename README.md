
Check later:

1. ASK TOMORROW: How do we plan our navigation categories, tags, nested dropdonw?
2. ASK TOMORROW: ASk the user for sign up and accept cookies.
3. We should have the fallback image in the boilerplate, as of now we may not get the image for example mostViews in month. 
4. different caching options, many places need fix. We need to determine which parts of the page is really important and need frech data also we need to centrlize the revalidate time if possible. 

Functions:

1. Render all author, create a page and a query to display the author - Kerlos
2. Dont forget to implement the view post logic to fire a call to the backend; src\app[slug]\components\InfinitePostFeed.tsx - Kerlos (Done) 
3. Moving from "use server" to server-only - Kerlos (Done)
4. Use ZOD for security for the Link purchase - Kerlos (Done)
5. Have fallback on all the API calls - Kerlos (Done)
6. Better sidebar content reccomenditations. Randomize more! - Gabbe
7. Share functionality - Gabbe

Consitency:

1. Use one importing convention either named(preferable) or default - Kerlos (Done)
2. Cleanup types, move them into /types if it's used more than once - Kerlos (Done) We should fix better the types better, as of now we are just making it work by just putting anything inside of the types. We should build a types that when we get an error then we dont fix the type to prevent the error but now that the response is wrong. 🤣
3. Move everything to Tailwind varibals - Gabbe
4. Look into Shadcn more to see for components and stuff like that - Gabbe

SEO:

1. Render Meta data - Kerlos (Done) Its done we 
2. Render only the first post title with H1, the rest should be H2 - Kerlos (Done)
3. Sitemap - Gabbe
4. robot.txt - Gabbe


Components:

1. Get Pouplar post - Kerlos http://boilerplate.local/wp-json/hpv/v1/top-posts?popular (Display it at the start of the page, like a carosel). 
http://boilerplate.local/wp-json/hpv/v1/top-posts?popular(Little bit strange how the response data, same post not the heights?)

Optimizations:

1. Considere using dynamic loading, priority and moving from one rendering strategy to another. - Kerlos
2. Also Also runtime = edge can increase performance - Kerlos
3. Reduce api calls, make a better planning for the api calls. And check the caching options - Kerlos
remember that fetch("local/:id") they are cached
Dynamic loading here; src\lib\graph_queries\getPostBySlug.ts; do we need revalidate there, and maybe cache options

4. React-vertualized - Kerlos (Done), not a bad choice and can be used in listing when the scrollbehavior doesnt fuck the design
5. Delay Search request by 1 sec - Gabbe

6. We are importing
import Link from 'next/link'; 6 times
import Image from 'next/image'; 5 times
