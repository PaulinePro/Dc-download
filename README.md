# Dc-download

A Downloader in order to download the images in Dcard's forum. Hope it will be helpful :)

### getposts.js
```node getposts.js```

Get `post ids` in post list and `sadd` to `postids`.

### getpost.js
```node getpost.js```

`spop` from `postids` and find out all `imgur link` inside content, then `sadd` to `imgur`.

### download.js
```node download.js```

`spop` from `imgur`, then download to disk.
