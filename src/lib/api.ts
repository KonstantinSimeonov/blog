// lib/api.ts
import fs from "fs";
import { join } from "path";
import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeShiki from "@leafac/rehype-shiki"
import * as shiki from "shiki"

// memoize/cache the creation of the markdown parser, this sped up the
// building of the blog from ~60s->~10s
let p: ReturnType<typeof getParserPre> | undefined;

async function getParserPre() {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .use(rehypeShiki, {
      highlighter: await shiki.getHighlighter({ theme: `nord` })
    })
    //.use(remarkParse)
    //.use(remarkRehype)
    //.use(remarkGfm)
}

function getParser() {
  if (!p) {
    p = getParserPre().catch((e) => {
      p = undefined;
      throw e;
    });
  }
  return p;
}

export async function getPostById(id: string) {
  const fullPath = join(process.cwd(), "posts", id);
  const content =
    await fs.promises.readFile(fullPath, "utf8")

  const parser = await getParser();
  const html = await parser.process(content);

  return {
    title: id,
    id: id,
    //date: `${data.date?.toISOString().slice(0, 10)}`,
    html: html.value.toString(),
  };
}

export async function getAllPosts() {
  const posts = await Promise.all(
    fs.readdirSync("posts").map(getPostById)
  );
  return posts
}
