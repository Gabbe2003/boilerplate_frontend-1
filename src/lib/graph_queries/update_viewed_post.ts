'use server';

// import { loggedFetch } from "../logged-fetch";

const update_view_uri: string = process.env.VIEWS_ENDPOINT!;

export async function update_viewed_post(postID: string) {
  try {
    await fetch(`${update_view_uri}/${postID}`, {
      method: 'POST',
      cache: 'no-store',
    });
    console.log('Post viewed updated successfully:', postID);

    //  await loggedFetch(`${update_view_uri}/${postID}`, {
    //   method: "POST",
    //   cache: "no-store",
    //   context: "updateViewedPost",
    // });
  } catch (error) {
    console.error('Error updating viewed post:', error);
  }
}
