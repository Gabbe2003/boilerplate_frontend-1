To fix 

ASK TOMORROW: How do we plan our navigation categories, tags, nested dropdonw?
ASK TOMORROW: ASk the user for sign up and accept cookies. 

different caching options, many places need fix

remember that fetch("local/:id") they are cached
Functions:

1. Dont forget to implement the view post logic to fire a call to the backend; src\app\[slug]\components\InfinitePostFeed.tsx - Kerlos (Done) just check it if everything is correct once the endpoint is correct. 

2. Moving from "use server" to server-only - Kerlos (Done)
3. Better sidebar content reccomenditations. Randomize more! - Gabbe
4. Share functionality - Gabbe
5. Render all pages, author, posts, - Kerlos
6. Use ZOD for security for the Link purchase - Kerlos (Done)
7. Have fallback on all the API calls - Kerlos (Done)


Consitency:
1. Move everything to Tailwind varibals - Gabbe
2. Look into Shadcn more to see for components and stuff like that - Gabbe
3. Use one importing convention either named(preferable) or default - Kerlos (Done)
4. Cleanup types, move them into /types if it's used more than once - Kerlos (Done) We should fix better the types better, as of now we are just making it work by just putting anything inside of the types. We should build a types that when we get an error then we dont fix the type to prevent the error but now that the response is wrong. 🤣

SEO: 

 1. Render Meta data - Kerlos (Done)
 2. Render only the first post title with H1, the rest should be H2 - Kerlos (Done)
 3. Sitemap - Gabbe
 4. robot.txt - Gabbe

Components:
1. Get Pouplar post - Kerlos


Optimizations:

1. React-vertualized - Kerlos (Done), not a bad choice and can be used in listing when the scrollbehavior doesnt fuck the design

2. Considere using dynamic loading, priority and moving from one rendering strategy to another. - Kerlos
3. Also Also runtime = edge can increase performance - Kerlos
4. Reduce api calls - Kerlos
5. Delay Search request by 1 sec - Gabbe

7. We are importing 
import Link from 'next/link';6 times
import Image from 'next/image'; 5 times 


6. Dynamic loading here; src\lib\graph_queries\getPostBySlug.ts; do we need revalidate there, and maybe cache options

