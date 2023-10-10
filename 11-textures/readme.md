# Three.js Journey

## Setup

Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```

## References

[Creating a WebGL Earth with three.js](https://blog.mastermaps.com/2013/09/creating-webgl-earth-with-threejs.html)

[Shaded Relief](http://shadedrelief.com/index.html)

[Natural Earth III](http://www.shadedrelief.com/natural3/index.html)

To obtain information about an image's resolution using ImageMagick on macOS, you can use the following command:

```bash
identify -verbose /path/to/image
```

To specifically get the resolution, you can filter the output:

```bash
identify -verbose /path/to/image | grep Resolution
```

To resize an image to a maximum dimension of 1024 pixels while maintaining its aspect ratio, you can use:

```bash
convert /path/to/input.jpg -resize "1024x1024>" /path/to/output.jpg
```

This will ensure the image is resized so that its largest dimension is 1024 pixels or less.
