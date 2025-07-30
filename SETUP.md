# BestPapers Hero Setup

## Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Required for Vercel Blob (Production)
```env
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
```

### Optional for Development
If you don't have Vercel Blob configured, the upload will fall back to local storage.

## Features Implemented

### ✅ Hero Section
- **Headline**: "Turn Your Best Papers into Career Ready Opportunities" with gradient text
- **Subheadline**: Exact copy as specified
- **CTAs**: "Explore Top Papers" (links to /browse) and "Publish Your Paper" (focuses uploader)
- **Responsive design**: Mobile-first with proper breakpoints

### ✅ Upload Component
- **Dropzone integration**: Uses dropzone v6 with React wrapper
- **File validation**: Accepts .pdf, .doc, .docx up to 25MB
- **Progress bar**: Animated progress with gradient styling
- **Success feedback**: Confetti animation and success message
- **Accessibility**: Full keyboard navigation and ARIA labels

### ✅ API Route
- **File upload**: `/api/upload` route with Vercel Blob support
- **Fallback storage**: Local temp storage for development
- **Error handling**: Proper validation and error responses

### ✅ Styling
- **Custom colors**: bp.bg, bp.text, bp.primary, bp.secondary, bp.accent
- **Fonts**: Fraunces (serif, 700) for headings, Inter (sans) for body
- **Gradients**: from-[#7A3CFF] via-[#5E6DFF] to-[#2E9BFF]
- **Responsive**: Mobile-first with proper container widths

## File Structure

```
src/
├── app/
│   ├── api/upload/route.ts    # Upload API endpoint
│   ├── globals.css            # Global styles with font utilities
│   ├── layout.tsx             # Root layout with font imports
│   └── page.tsx               # Main page with new hero
├── components/
│   ├── hero.tsx               # New hero component
│   └── uploader.tsx           # Dropzone wrapper component
└── lib/
    └── confetti.ts            # Confetti helper function
```

## Usage

1. Start the development server:
```bash
npm run dev
```

2. Navigate to `http://localhost:3000`

3. Test the upload functionality by dragging a PDF, DOC, or DOCX file onto the dropzone

## Production Deployment

For production deployment on Vercel:

1. Add the `BLOB_READ_WRITE_TOKEN` environment variable in your Vercel dashboard
2. Deploy the application
3. The upload functionality will use Vercel Blob for file storage

## Browser Support

- Modern browsers with ES6+ support
- File drag & drop API
- Canvas API for confetti animation 