
fixa. >  import Doc from '../components/icons/doc';




                    **** TO DOOO ****

We start be fixing the component section (Done)
Fixed the Images with fallbacks. (Done)
Considere using dynamic loading, priority and moving from one rendering strategy to another. - Kerlos (Done)
And check the caching options - Kerlos (Done)
remember that fetch("local/:id") they are cached (Done)
Then we have to fix the caching strategies and then we read the whole code and then (Done)
Reduce api calls, make a better planning for the api calls. (Alosmt done )

We should make the navigation like this /news/post_name, as of now when we navigate to a 404 page we are getting an error becuase [slug]/page.tsx expect another input.
Fix the author design and robots/sitemap

(There are some errors in production code, not major but recheck them:

1. The update post is not working
2. The cache is kinda off, sometimes it revalidate and sometimes not?. s
   )
   When we are in the slug we there is so many calls
   fix the api calls and reuse components and optimizitions here and there,

then we fix the npm run build.

INFO
Server and client components can be used together but as a recommendation for seo, performance and security. Using client components inside of a server compoment is much better. Also when using "use client" all imports/children becomes client too, so becareful with the imports, place "use server where it needs". There is something called fetch memoization which basically cache the request that you have sent as long as the parameters, query, url and everything matches and it only applies on get request, if the response changes the result will be the first version until the revalidate. I believe using fetch memoization is better for performance, we have to look it up.

                    **** TO DOOO ****

Check later:
Right now when we scroll down the posts the viewed function is being triggered? is it correct

1. ASK TOMORROW: How do we plan our navigation categories, tags, nested dropdonw? (Still unsure if we are going to implemenet it)
2. ASK TOMORROW: ASk the user for sign up and accept cookies. There is no need the ads can run without consent also itss just addprofit that required it (Done)

3. different caching options, many places need fix. We need to determine which parts of the page is really important and need frech data also we need to centrlize the revalidate time if possible.

Functions:

1. Render all author, create a page and a query to display the author - Kerlos (Done)
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

For consistency we should have an universal varibals to control the the page. for example all components have different margin from the page(header and the posts). Also one for buttons to.

SEO:

1. Render Meta data - Kerlos (Done)
2. Render only the first post title with H1, the rest should be H2 - Kerlos (Done)
3. Sitemap - Gabbe
4. robot.txt - Gabbe

Components:

1. Get Pouplar post - Kerlos http://boilerplate.local/wp-json/hpv/v1/top-posts?popular (Display it at the start of the page, like a carosel).
   http://boilerplate.local/wp-json/hpv/v1/top-posts?popular(Little bit strange how the response data, same post not the heights?)
2. Fix the carosel, make a component that accept children and return a component.
   stripHTML, getFeaturedImageUrl.

Optimizations: 4. React-vertualized - Kerlos (Done), not a bad choice and can be used in listing when the scrollbehavior doesnt fuck the design 5. Delay Search request by 1 sec - Gabbe

later:

1. Also Also runtime = edge can increase performance - Kerlos (Done) We can add it later, we can also check the erros and the prons. it will be lightning fast, TTFB, performance,

boilerplate_frontend\src\styles\globals.css
boilerplate_frontend\src\app\components\MonthPouplarPosts.tsx



Fix: Page for Cat/Tag, & single page for each Cat/Tag
Fix: Double render for the popupmodal