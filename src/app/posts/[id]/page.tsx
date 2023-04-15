import { Post } from "@/app/Post";
import { getAllPosts, getPostById } from "@/lib/api";

type Props = { params: { id: string } };

const PostById = async ({ params: { id } }: Props) => (
  <Post post={await getPostById(id)} />
);

export default PostById;

export async function generateStaticParams() {
  const ps = await getAllPosts();
  return ps.map((p) => ({ id: p.id }));
}
