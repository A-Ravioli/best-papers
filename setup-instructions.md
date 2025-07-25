# Setup Instructions for Best Papers

## 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully set up
3. Go to Settings > API to get your project URL and anon key
4. Update `.env.local` with your credentials (already done)

## 2. Database Setup

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Copy and paste the entire contents of `supabase-schema.sql` into the editor
4. Click "Run" to execute the SQL

This will create:
- All required tables (papers, likes, comments)
- Row Level Security policies
- Storage bucket for PDF files
- Triggers for updated_at timestamps

## 3. Test the Application

The app is now running at http://localhost:3000

### Test Flow:
1. Visit http://localhost:3000 - should see the landing page
2. Click "Sign In with Email" - should go to login page
3. Create an account with your email
4. Check your email for confirmation link and click it
5. Sign in and you should see the dashboard
6. Try uploading a PDF via the "Upload Paper" button
7. Test liking and commenting on papers

## 4. Verification

- ✅ Next.js app running on port 3000
- ✅ Tailwind CSS working
- ✅ Environment variables configured
- ⏳ Database schema needs to be applied
- ⏳ Test user registration and file upload

## Features Ready:
- Landing page with sign-in
- User authentication (sign up/in/out)
- Dashboard with recent and trending papers
- PDF upload with drag-and-drop
- Individual paper viewing with embedded PDF
- Like/dislike functionality
- Comment system
- User profile page
- Responsive design with dark mode support

The application is fully functional once you complete the Supabase database setup!