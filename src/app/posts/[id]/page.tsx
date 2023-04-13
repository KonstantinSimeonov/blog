import { getAllPosts, getPostById } from "@/lib/api"

export default async function Post({ params: { id } }: { params: { id: string } }) {
  const post = await getPostById(id)

  return (
    <article>
      <header>
        <h2>{post.title}</h2> //
        <time>{post.date}</time>
      </header>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  )
}

export async function generateStaticParams() {
  const ps = await getAllPosts()
  return ps.map(p => ({ id: p.id }))
}
