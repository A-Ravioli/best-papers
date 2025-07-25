# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Best Papers is a Next.js + Supabase web application for sharing and discovering academic papers and research writing. Users can upload PDFs, like/comment on papers, and discover trending research.

## Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, Authentication, File Storage)
- **Authentication**: Supabase Auth with email/password
- **File Storage**: Supabase Storage for PDF uploads
- **Styling**: Tailwind CSS with dark mode support

## Common Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Environment Setup

1. Copy `.env.example` to `.env.local`
2. Add your Supabase project URL and anon key:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Database Schema

Execute the SQL in `supabase-schema.sql` in your Supabase SQL editor to set up:
- `papers` table: Stores paper metadata and file references
- `likes` table: Tracks user likes on papers
- `comments` table: Stores user comments on papers
- RLS policies for security
- Storage bucket for PDF files

## Architecture

### Page Structure
- `/` - Landing page with sign-in
- `/login` - Authentication page (sign in/up)
- `/dashboard` - Main feed with recent and trending papers
- `/upload` - PDF upload form
- `/paper/[id]` - Individual paper view with comments
- `/profile` - User's uploaded papers

### Key Components
- `PaperCard` - Displays paper info with like/comment actions
- `CommentSection` - Shows comments with add comment form
- `LogoutButton` - Client-side logout functionality

### Supabase Integration
- `src/lib/supabase/client.ts` - Browser client
- `src/lib/supabase/server.ts` - Server client for SSR
- `src/lib/supabase/middleware.ts` - Auth middleware
- `middleware.ts` - Next.js middleware for protected routes

## Features

- **Authentication**: Email/password with Supabase Auth
- **File Upload**: Drag-and-drop PDF upload to Supabase Storage
- **Social Features**: Like/dislike papers, comment system
- **Paper Discovery**: Recent papers feed, trending algorithm
- **PDF Viewing**: Embedded PDF viewer in browser
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Dark Mode**: Built-in dark mode support

## Development Notes

- All pages under `/dashboard`, `/upload`, `/profile`, `/paper/*` require authentication
- File uploads are validated (PDF/DOC/DOCX, max 10MB)
- Trending algorithm based on recent likes (7 days)
- Real-time features use Supabase's built-in subscriptions
- All database interactions use Row Level Security (RLS)

## License

Apache License 2.0