import { revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();
    await revalidateTag(`author-${slug}`);
    return Response.json({ revalidated: true, slug });
  } catch (err) {
    return Response.json(
      { revalidated: false, error: (err as Error).message },
      { status: 500 },
    );
  }
}
