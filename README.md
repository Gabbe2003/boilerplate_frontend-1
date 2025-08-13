

Footer and header can each call their own fetch


add then a tags to revalidate which is may better
Fix the import 'server-only's instead of "use server" just make sure we are appending the right top for every file. And then we look over the logic once more. 


2. The footer is responsive but looks off on different breaking points, 
we can make the footer ssr if we want and then make getLogo server the download the icon and then serve it instead of being called reguraly which is what is happening, as for the tagling we can expose an api route for that and then remove the useEffect in the store becuase it is not needed and then we can move the links into the footer. That way we have better performance and seo. 

3. Check the code there are many places that uses <a>, <button> etc. Make sure to use next and shadcn PopupModal(I uploaded a code there try it, and commented out the old one) for example.   



Check those
1. src\app\components\ads\adsPopup.tsx || I think we can refactor here to server?
2. src\app\components\Rule_sub.tsx || Optimize the code and make it easier
3. src\app\components\allSocialMediaButtons.tsx || Social media buttons should be dynamic not finanstidning

Remove the api route because we dont need to expose any data outside our app


When we try the page out we just need to make sure the advertiesment and contact. 

1. Header optimize > When the page render there is a delay.
2. News letter popup twice double check it. 
3. Searchbar/hamburger menu drawer width. Optimize logic. 
4. Style the whole page
5. SEO. meta tags opengraph and double check everything. 
6. Delay ad popup 10 seconds
7. Make sure all images look are optimized. 
8. Decide what post data will show for the user. 
9. Add robots/sitemap
10. Trigger the update post on infinity scroll. 


There are some errors in production code, not major but recheck them:
   
The render modal is being called three times.    
When we are in the slug we there is so many calls
fix the api calls and reuse components and optimizitions here and there,

then we fix the npm run build.

INFO
Server and client components can be used together but as a recommendation for seo, performance and security. Using client components inside of a server compoment is much better. Also when using "use client" all imports/children becomes client too, so becareful with the imports, place "use server where it needs". There is something called fetch memoization which basically cache the request that you have sent as long as the parameters, query, url and everything matches and it only applies on get request, if the response changes the result will be the first version until the revalidate. I believe using fetch memoization is better for performance, we have to look it up.

**** TO DOOO ****

Check later:

