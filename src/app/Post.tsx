import { PostData } from "@/lib/api"
import * as React from "react"

export const Post: React.FC<{ post: PostData }> = ({ post }) => (
    <article>
      <header>
        <time>{`//`} {post.date}</time>
        <h2>{post.title}</h2>
      </header>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
)
