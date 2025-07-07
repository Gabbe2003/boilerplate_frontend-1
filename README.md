To fix 



1. Dont forget to implement the view post logic to fire a call to the backend; src\app\[slug]\components\InfinitePostFeed.tsx
2. in post change from looking on finanstindinge.se to the current post name. 
3. Moving from "use server" to server-only
4. Move everything to css globals and apply the necessary variables there. 
5. Look into Shadcn more to see for components and stuff like that.


For opt. 
react-vertualized
considere using dynamic loading, priority and moving from one rendering strategy to another. 
Also Also runtime = edge can increase performance 
reduce api calls 


Check for the main page, it is an SSG for most part. check for opt there 