import { PostData } from "@/lib/api"

export const generateMetadataForPost = (post: PostData) => {
  const title = `${post.title} | blog.konsimeonov.com`
  const { description, date } = post
  return {
    title,
    description,
    authors: [{ name: `Konstantin Simeonov`, url: `https://konsimeonov.lol` }],
    category: `programming`,
    openGraph: {
      title,
      description,
      images: `https://blog.konsimeonov.lol/og-image.png`, // TODO: figure this gem out
      publishedTime: date,
      type: `article`,
      authors: [`Konstantin Simeonov`]
    },
  }
}
