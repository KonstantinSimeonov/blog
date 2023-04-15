import "./styles/globals.css";
import Link from "next/link";
import React from "react";
import { getAllPosts, PostData } from "@/lib/api";

const Nav: React.FC<{ posts: readonly PostData[] }> = ({ posts }) => (
  <ol>
    {posts.map(({ id, title }) => (
      <li key={id}>
        <Link href={`/posts/${id}`}>{title}</Link>
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
          <Nav posts={posts} />
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
        <footer>
          <p>
            This blog is{` `}
            <Link
              target="_blank"
              href="https://github.com/KonstantinSimeonov/blog"
            >
              open-sauce
            </Link>
            ! If you enjoyed the read or learned something, give it a star (yes,
            I&apos;m begging for stars)
          </p>
        </footer>
      </body>
    </html>
  );
}
