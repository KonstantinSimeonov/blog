import { PostData } from "@/lib/api"
import * as React from "react"

export const Post: React.FC<{ post: PostData }> = ({ post }) => (
    <article>
      <header>
        <h2>{post.title}</h2> {`//`}
        <time>{post.date}</time>
      </header>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
)
