# Sample Assets for Ergiva

This directory contains placeholder assets for the Ergiva platform. Replace these with your actual assets.

## Directory Structure

```
sample-assets/
├── images/
│   ├── logo.png                 # Main logo
│   ├── logo-dark.png           # Dark version of logo
│   ├── favicon.ico             # Website favicon
│   ├── og-image.jpg            # Open Graph image for social sharing
│   ├── hero-bg.jpg             # Hero section background
│   ├── about-team.jpg          # About us team photo
│   ├── testimonial-1.jpg       # Customer testimonials
│   ├── testimonial-2.jpg
│   ├── testimonial-3.jpg
│   └── products/
│       ├── tens-machine.jpg
│       ├── hot-cold-pack.jpg
│       ├── resistance-bands.jpg
│       └── lumbar-support.jpg
├── videos/
│   ├── hero-demo.mp4           # Hero section demo video
│   └── testimonials/
│       ├── customer-1.mp4
│       └── customer-2.mp4
└── documents/
    ├── privacy-policy.pdf
    ├── terms-of-service.pdf
    └── physiotherapy-guide.pdf
```

## Image Specifications

### Logo
- **Format**: PNG with transparent background
- **Size**: 200x50px (for header), 400x100px (high resolution)
- **Colors**: Should work on both light and dark backgrounds

### Hero Images
- **Format**: JPG/WebP
- **Size**: 1920x1080px minimum
- **Quality**: High quality, optimized for web

### Product Images
- **Format**: JPG/WebP
- **Size**: 800x600px minimum
- **Background**: Clean white or transparent
- **Multiple angles**: Front, side, and in-use shots recommended

### Testimonial Images
- **Format**: JPG
- **Size**: 400x400px (square)
- **Quality**: Professional headshots preferred

## Video Specifications

### Demo Videos
- **Format**: MP4
- **Quality**: 1080p
- **Duration**: 30-60 seconds
- **Audio**: Optional with subtitles

### Testimonial Videos
- **Format**: MP4
- **Quality**: 720p minimum
- **Duration**: 30-90 seconds
- **Audio**: Clear audio with good lighting

## Usage in Code

Images are referenced in the code using Next.js Image component:

```tsx
import Image from 'next/image';

<Image
  src="/images/logo.png"
  alt="Ergiva Logo"
  width={200}
  height={50}
  priority
/>
```

For external images (like Unsplash), update the `next.config.js` domains array.

## Image Optimization

- Use WebP format when possible for better compression
- Implement lazy loading for images below the fold
- Provide different sizes for responsive design
- Use CDN for better performance

## Asset Credits

Current placeholder images are from:
- Unsplash (https://unsplash.com) - Free stock photos
- Replace with licensed or original images for production use

## Notes

- Ensure all images have proper alt text for accessibility
- Optimize images for web to reduce load times
- Use consistent styling and color scheme
- Test images on different screen sizes and devices