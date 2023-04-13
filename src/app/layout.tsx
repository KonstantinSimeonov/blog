import "./styles/globals.css";
import Link from "next/link";
import React from "react";
import { getAllPosts } from "@/lib/api";

const Nav: React.FC<{ posts: readonly string[] }> = ({ posts }) => (
  <ol>
    {posts.map((name) => (
      <li key={name}>
        <Link href={`/posts/${name}`}>{name}</Link>
      </li>
    ))}
  </ol>
);

export default async function Layout({ children }: React.PropsWithChildren) {
  const posts = await getAllPosts()
  return (
    <html lang="en">
      <body>
<main>
      <h1>My detailed and mostly wrong opinions on programming</h1>
          {children}</main>
          <aside>
            <h2>Posts</h2>
            <Nav posts={posts.map(p => p.id)} />
          </aside>
      </body>
    </html>
  );
}
