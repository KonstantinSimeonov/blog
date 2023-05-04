find out/ -type f -regex '.*.\(html\|css\)' -exec gzip -9 {} \; -exec mv {}.gz {} \;
