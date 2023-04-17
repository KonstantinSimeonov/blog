import { Post } from "@/app/Post";
import { generateMetadataForPost } from "@/app/post-metadata";
import { getAllPosts, getPostById } from "@/lib/api";
import { Metadata } from "next";
import "highlight.js/styles/panda-syntax-dark.css"

type Props = { params: { id: string } };

const PostById = async ({ params: { id } }: Props) => (
  <Post post={await getPostById(id)} />
)

export default PostById;

export async function generateStaticParams() {
  const ps = await getAllPosts();
  return ps.map((p) => ({ id: p.id }))
}

export const generateMetadata = ({ params }: Props): Promise<Metadata> =>
  getPostById(params.id).then(generateMetadataForPost)
