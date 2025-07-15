"use server"

import { GraphQLError, Post } from "../types";

const POPULAR_POST = process.env.POPULAR_POST!; 
export async function get_popular_post() : Promise<Post[]> {
  
  try {
    const res = await fetch(`${POPULAR_POST}`, {
      cache: "force-cache"
    })

    
    const json = (await res.json()) as {
      data?: { posts?: { nodes: Post[] } };
      errors?: GraphQLError;
    }
    return json ?? [];
  } catch (error) {
    console.log("An error occured");
    return []; 
  }
}
    