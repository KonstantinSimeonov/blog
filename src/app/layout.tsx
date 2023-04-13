import "./styles/globals.css";
import * as fs from "fs";
import * as path from "path";
import Link from "next/link";
import React from "react";

const getStaticProps = () => {
  const posts = fs
    .readdirSync(path.join(process.cwd(), `posts`))
    .map((name) => path.parse(name).name);
  return posts;
};

const Nav: React.FC<{ posts: readonly string[] }> = ({ posts }) => (
  <ul>
    <li>
      <Link href="/">Home</Link>
    </li>
    {posts.map((name) => (
      <li key={name}>
        <Link href={`/posts/${name}`}>{name}</Link>
      </li>
    ))}
  </ul>
);

export default function Layout({ children }: React.PropsWithChildren) {
  const posts = getStaticProps();
  return (
    <html lang="en">
      <body>
          <main>{children}</main>
          <aside>
            <h2>Posts</h2>
            <Nav posts={posts} />
          </aside>
      </body>
    </html>
  );
}
