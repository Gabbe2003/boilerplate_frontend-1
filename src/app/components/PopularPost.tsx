
import Link from "next/link";
import {get_popular_post} from "../../lib/graph_queries/getPopularPost"
import Image from "next/image";

export default async function PopularPost(){
    const post = await get_popular_post(); 
    
    return (
        <>
            <div className="flex gap-10 mt-3">
                {post.map((item, index) => {
                    const safeDate = item.date.replace('+00:00', 'Z'); // replace with 'Z' for UTC
                    const formattedDate = new Date(safeDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    });

                    return (
                        <div key={index}>
                            <Link href={`${item.slug}`}>
                                <Image
                                    src={item.featured_image}
                                    width={100}
                                    height={70}
                                    alt={item.title}
                                    className="object-cover rounded"
                                    style={{ width: '100px', height: '70px' }}
                                />
                                <h4>{item.title}</h4>
                                <p>{formattedDate}</p>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </>
    )
}