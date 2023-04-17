find out/ -name '*.html' | tee | xargs -I % sh -c 'node nuke-script-tags.js %'
rm -f $(find out/ | grep -E '.*\.(js|txt)')
rm -rf out/_next/static/chunks/
