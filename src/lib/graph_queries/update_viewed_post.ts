'use server';

const update_view_uri: string = process.env.VIEWS_ENDPOINT!;

export async function update_viewed_post(postID: string) {
  try {
    await fetch(`${update_view_uri}/${postID}`, {
      method: 'POST',
      cache: 'no-store',
    });

  } catch (error) {
    console.error('Error updating viewed post:', error);
  }
}
