## Blog
Built with nextjs canary and experimental app dir<sub><sub>for which I suffered</sub></sub>

## Running

```bash
npm i
npm run dev
```

## Todos
- fix code highlighting not wrapping properly
  - bit the bullet and let the double scroll live for now
- maybe switch to vite ssg
- ~research how to render a javascript-free site~
  - `unstable_runtimeJS: false` isn't working for this version of next so far
  - **turbo nuked the unnecessary scripts with a regex, lmao**
- ~add prettier and spellcheck~
- ~fix the rehype shiki deps~
- add documentation
- language playground integration
  - a link which redirects to playground
  - iframe with playground
  - integrated playground
- ~center the layout~
- ~gzip the stuff~
