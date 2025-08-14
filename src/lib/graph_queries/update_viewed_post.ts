import "server-only"; 

export async function update_viewed_post(postID: string) {
  console.log('Updating viewed post:', postID);
  try {
    await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/wp-json/hpv/v1/log-view/${postID}`, {
    method: 'POST',
    cache: 'no-store',
  });

  } catch (error) {
    console.error('Error updating viewed post:', error);
  }
}
