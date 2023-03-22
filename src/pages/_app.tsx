import "@/styles/globals.css";
import type { AppProps } from "next/app";
import * as fs from "fs";
import * as path from "path";
import Link from "next/link";
import { InferGetStaticPropsType } from "next";

export const getStaticProps = () => {
  console.log(5555)
  const posts = fs
    .readdirSync(path.join(process.cwd(), `src`, `pages`, `posts`))
    .map((name) => path.parse(name).name);
  return {
    appProps: {
      posts,
    },
  };
};

type HomeProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function App({
  Component,
  pageProps,
  appProps
}: AppProps & { appProps: HomeProps }) {
  const { posts } = appProps;
  return (
    <>
      <main>
        <Component {...pageProps} />
      </main>
      <aside>
        <h2>Posts</h2>
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
      </aside>
    </>
  );
}
