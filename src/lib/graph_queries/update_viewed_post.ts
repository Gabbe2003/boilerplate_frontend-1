"use server";

const update_view_uri: string = process.env.VIEWS_ENDPOINT!;

export async function update_viewed_post(postID: string) {
  try {
    const res = await fetch(`${update_view_uri}:${postID}`, {
      method: "POST",     
      cache: "no-store"
    });
    console.log(res.status);
    
  } catch (error) {
    console.error("Error updating viewed post:", error);
  }
}
