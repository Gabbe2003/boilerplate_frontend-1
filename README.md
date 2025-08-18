



1. Rate limiter, check security
2. Organize graph queries
3. Add popup
4. Check the code there are many places that uses <a>, <button> etc. Make sure to use next and shadcn PopupModal(I uploaded a code there try it, and commented out the old one) for example.
5. Style the whole page
6. SEO. meta tags opengraph and double check everything.
7. Make sure all images look are optimized.
8. Decide what post data will show for the user.
9. Add robots/sitemap



INFO
Server and client components can be used together but as a recommendation for seo, performance and security. Using client components inside of a server compoment is much better. Also when using "use client" all imports/children becomes client too, so becareful with the imports, place "use server where it needs". There is something called fetch memoization which basically cache the request that you have sent as long as the parameters, query, url and everything matches and it only applies on get request, if the response changes the result will be the first version until the revalidate. I believe using fetch memoization is better for performance, we have to look it up.

\***\* TO DOOO \*\***

Check later:

CREATE A TODAYS NEWS MARKET LIKE DI.SE
