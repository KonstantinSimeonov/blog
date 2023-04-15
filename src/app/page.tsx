import { getAllPosts } from "@/lib/api";
import { Post } from "./Post";

const Index = async () => {
  const [post] = await getAllPosts();
  return <Post post={post} />;
};

export default Index;
