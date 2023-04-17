const fs = require(`fs`)

const cleansed = fs
  .readFileSync(process.argv[2], `utf8`)
  .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ``)

fs.writeFileSync(
  process.argv[2],
  cleansed,
)
