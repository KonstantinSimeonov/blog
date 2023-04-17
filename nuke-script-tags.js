process.stdout.write(
  require(`fs`)
    .readFileSync(0, `utf8`)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ``)
)
