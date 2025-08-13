# Homepage Image Guide (Firebase Storage)

Upload assets to Firebase Storage and reference the public URLs in `pages/home`.

Recommended sizes
- hero.image.src: 2400×1350 (16:9), WebP preferred
- roomHighlight.image.src: 1600×1200 (4:3)
- techniques[0|1].image.src: 1600×1200 (4:3) or 1600×1000 (16:10)
- craftsmanship.image.src (heritage banner): ~2400×1100 (≈21:9)
- lookbook.thumbnail.src: 1200×900 (4:3)

General rules
- Compress to WebP/AVIF, quality 75–85
- Provide descriptive `alt` text
- Ensure Storage rules allow public read for images

Seeding
- Run `npm run seed:home` to create/update the `pages/home` document with placeholders. Replace the image URLs afterward in Firestore.
