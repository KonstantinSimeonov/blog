// lib/api.ts
import fs from "fs";
import { join } from "path";
import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import matter from "gray-matter"
import rehypeHighlight from "rehype-highlight";
import hs from "highlight.js/lib/languages/haskell"
import ts from "highlight.js/lib/languages/typescript"

async function getParserPre() {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkToc, { heading: `Contents` })
    .use(remarkRehype)
    .use(rehypeStringify)
    .data(`settings`, { fragment: true })
    .use(rehypeHighlight, { languages: { hs, haskell: hs, ts, typescript: ts } })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      content: (arg) => ({
        type: "element",
        tagName: "a",
        properties: {
          href: "#" + arg.properties?.id,
          style: "margin-right: 10px",
        },
        children: [{ type: "text", value: "#" }],
      }),
    });
    //.use(remarkParse)
    //.use(remarkRehype)
    //.use(remarkGfm)
}

const parserPromise = getParserPre()

export async function getPostById(id: string) {
  const fullPath = join(process.cwd(), "posts", `${id}.md`);
  const { data, content } = matter(
    await fs.promises.readFile(fullPath, "utf8")
  )

  const parser = await parserPromise;
  const html = await parser.process(content);

  return {
    title: data.title as string,
    id,
    description: data.description as string,
    date: `${data.date?.toISOString().slice(0, 10)}`,
    html: html.value.toString(),
  };
}

export type PostData = Awaited<ReturnType<typeof getPostById>>

export async function getAllPosts() {
  const posts = await Promise.all(
    fs.readdirSync("posts").map(p => getPostById(p.replace(/.md$/, ``)))
  );
  return posts.sort((p1, p2) => p1.date.localeCompare(p2.date))
}
