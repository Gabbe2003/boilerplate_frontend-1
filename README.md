
Footer and header back to ssr redo.
fix the adspop up on tablet, the image is fked.
in popular post there are times when we display two ads next to each other.

In seach we are looking for the input letter and check if it exsist from right to left,we are matching letter by letter which is wrong we have to check for the whole title if the letter exsists. If we type a letter that doesnt exsists on the searchbar and hit enter, BUT if any post have that letter it will be shown. FIX 

Hide the ticker on mobile, it takes to much space, and the search bar?

add pop up, contain is better than cover, at least on mobile?. And the look of it is like my dick, it is really bad, like on tablet and mobile, 
the newsletter modal is also fuked on mobile.  

we are passing tag title not the slug
when we navigate to category we are we are seeing missin slug. 
http://localhost:3000/tag
http://localhost:3000/category

here we are not seeing anything?
http://localhost:3000/author 

1. Rate limiter (Done)  
2. Organize graph queries (Done)
3. Add popup
4. Check the code there are many places that uses <a>, <button> etc. Make sure to use next and shadcn PopupModal(I uploaded a code there try it, and commented out the old one) for example.
5. Style the whole page
6. SEO. meta tags opengraph and double check everything.
7. Make sure all images look are optimized.
8. Decide what post data will show for the user.
9. Add robots/sitemap
10. check security



INFO
Server and client components can be used together but as a recommendation for seo, performance and security. Using client components inside of a server compoment is much better. Also when using "use client" all imports/children becomes client too, so becareful with the imports, place "use server where it needs". There is something called fetch memoization which basically cache the request that you have sent as long as the parameters, query, url and everything matches and it only applies on get request, if the response changes the result will be the first version until the revalidate. I believe using fetch memoization is better for performance, we have to look it up.

\***\* TO DOOO \*\***

Check later:

CREATE A TODAYS NEWS MARKET LIKE DI.SE
