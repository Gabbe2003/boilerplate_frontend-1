
import Link from "next/link";
import {get_popular_post} from "../../lib/graph_queries/getPopularPost"
import Image from "next/image";


export default async function PopularPost(){
    const post = await get_popular_post(); 
    
    return (
        <>
            <div className="flex gap-10 mt-6 mb-5">
                {post.map((item, index) => {
                    console.log(item.publish_date);
                    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    });
                    return (
                        <div key={index}>
                            <Link href={`${item.slug}`}>
                                <Image 
                                    src={item.featured_image || ""}
                                    width={100}
                                    height={40}
                                    alt={`${item.title}`}
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