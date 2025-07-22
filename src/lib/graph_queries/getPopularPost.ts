"use server"

import { GraphQLError, Post } from "../types";

const POPULAR_POST = process.env.POPULAR_POST!;
import FEATURED_IMAGE from '../../../public/next.svg';

export async function get_popular_post(): Promise<Post[]> {
  
  try {
    const res = await fetch(`${POPULAR_POST}`, {
    });
    
    // const res = await loggedFetch(`${POPULAR_POST}`, {
      // context: "getPopularPost",
    // });
    
    const json = (await res.json()) as {
      data?: { posts?: { nodes: Post[] } };
      errors?: GraphQLError;
    };
    
    // Always return an array
    const posts = json.map((post) => {
      if(!post.featured_image || post.featured_image === "") {
        post.featured_image = FEATURED_IMAGE
      }
    })

    return json ?? [];
  } catch (error) {
    console.log("An error occured", error);
    return [];
  }
}
