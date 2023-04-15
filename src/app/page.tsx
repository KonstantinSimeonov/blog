import { getAllPosts } from "@/lib/api";
import { Post } from "./Post";
import { generateMetadataForPost } from "./post-metadata";

const Index = async () => {
  const [post] = await getAllPosts();
  return <Post post={post} />;
};

export default Index;

export const generateMetadata = async () => {
  const [post] = await getAllPosts()
  return generateMetadataForPost(post)
}
