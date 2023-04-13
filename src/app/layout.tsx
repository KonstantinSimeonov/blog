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
  const posts = await getAllPosts();
  return (
    <html lang="en">
      <body>
        <main>
          <h1>My detailed and mostly wrong opinions on programming</h1>
          {children}
        </main>
        <aside>
          <h2>Posts</h2>
          <Nav posts={posts.map((p) => p.id)} />
          <h2>Author</h2>
          <ol>
            <li>
              <Link href="https://github.com/KonstantinSimeonov">Github</Link>
            </li>
            <li>
              <Link href="https://konsimeonov.lol">Website</Link>
            </li>
            <li>
              <Link href="https://www.hackerrank.com/kon_trombon">
                Hackerrank
              </Link>
            </li>
          </ol>
        </aside>
      </body>
    </html>
  );
}
