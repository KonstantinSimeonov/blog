import Head from "next/head"
import * as fs from "fs"
import * as path from "path"
import {InferGetStaticPropsType} from "next"
import Link from "next/link"

export const getStaticProps = () => {
  const posts = fs.readdirSync(path.join(process.cwd(), `src`, `pages`, `posts`)).map(
    name => path.parse(name).name
  )
  return {
    props: {
      posts
    }
  }
}

type HomeProps = InferGetStaticPropsType<typeof getStaticProps>

export default function Home({ posts }: HomeProps) {
  return (
    <>
      <Head>
        <title>Blog</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Blog</h1>
        <ul>{posts.map(name =>(
          <li key={name}>
            <Link href={`/posts/${name}`}>{name}</Link>
          </li>
        ))}</ul>
      </main>
    </>
  )
}
