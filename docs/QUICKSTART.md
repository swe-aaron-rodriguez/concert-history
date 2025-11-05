# Quick Start Guide

Get the Setlist Visualizer MVP running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Setlist.fm account (free)
- A Setlist.fm API key ([get one here](https://api.setlist.fm/docs/1.0/index.html))

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local and add your API key
# SETLISTFM_API_KEY=your_actual_api_key_here
```

To get your API key:
1. Visit https://www.setlist.fm/settings/api
2. Sign in to your Setlist.fm account
3. Apply for an API key (approval is usually instant)
4. Copy the key to your `.env.local` file

### 3. Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## Testing the Application

### Test with Your Own Account

1. Go to http://localhost:3000
2. Enter your Setlist.fm username
3. View your concert history!

### Test with a Popular User

Try these usernames with lots of concert history:

- `musiclover123` (example user with many concerts)
- Or any active Setlist.fm user you know

### Test Direct Setlist Links

Setlists can be accessed directly via:
```
http://localhost:3000/setlist/{setlist-id}
```

Find setlist IDs by:
1. Viewing a concert in your timeline
2. Copying the ID from the URL
3. Sharing the link with friends!

## Common Issues

### "API key is required" Error

**Problem**: Missing or incorrect API key

**Solution**:
1. Check that `.env.local` exists
2. Verify `SETLISTFM_API_KEY=your-key` is set correctly
3. No quotes around the key value
4. Restart the dev server after changing `.env.local`

### "User not found" Error

**Problem**: Username doesn't exist or has no attended concerts

**Solution**:
1. Verify the username is correct (case-sensitive)
2. Check the user has marked concerts as "attended" on Setlist.fm
3. Try a different username

### "Rate limit exceeded" Error

**Problem**: Too many API calls (rare in development)

**Solution**:
1. Wait a few seconds between requests
2. The rate limiter prevents this automatically
3. Check you're not making requests in a loop

### Blank Page or Build Errors

**Problem**: TypeScript or dependency issues

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

## Development Tips

### Development Mode

Speed up testing by enabling `DEV_MODE` in your `.env.local`:

```bash
DEV_MODE=true
```

When enabled:
- ✅ Only fetches first page of concerts (~20 concerts)
- ✅ Much faster testing (1 API call instead of multiple)
- ✅ Debug logging enabled

**Remember to disable for production!**

### Hot Reload

Next.js automatically reloads when you save files. Changes appear instantly!

### View API Responses

Open browser DevTools (F12) → Network tab to see API calls and responses.

### Cache Behavior

- User concerts: Cached for 1 hour
- Individual setlists: Cached for 24 hours
- Restart server to clear cache
- In dev mode, clear cache by restarting server

### Tailwind CSS

The project uses Tailwind CSS. Classes are applied directly in JSX:

```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Hello!
</div>
```

## Project Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Production
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Type Checking
npx tsc --noEmit     # Check TypeScript types
```

## File Structure Overview

```
src/
├── app/
│   ├── page.tsx                    # Home page (username input)
│   ├── user/[username]/page.tsx    # User timeline
│   ├── setlist/[id]/page.tsx       # Setlist detail
│   └── api/                        # API routes
├── components/                      # React components
│   ├── UsernameForm.tsx
│   ├── ConcertCard.tsx
│   ├── YearFilter.tsx
│   └── ConcertSkeleton.tsx
├── lib/                            # Core logic
│   ├── setlistfm-client.ts        # API client
│   ├── cache.ts                   # Caching layer
│   └── rate-limiter.ts            # Rate limiting
└── types/
    └── setlistfm.ts               # TypeScript types
```

## Making Changes

### Add a New Component

1. Create file in `src/components/MyComponent.tsx`
2. Export default function
3. Import where needed

### Modify API Behavior

Edit `src/lib/setlistfm-client.ts`:
- Change cache TTL in `CACHE_TTL`
- Add new API methods
- Modify data processing

### Update Styles

Edit `src/app/globals.css` for global styles, or use Tailwind classes inline.

## Next Steps

- ✅ Test the app locally
- ✅ Customize the design
- ✅ Deploy to Vercel (see main README)
- 📖 Read [`REDIS_MIGRATION.md`](./REDIS_MIGRATION.md) for production caching

## Need Help?

- Check the main [README.md](../README.md)
- Review the code comments
- Open an issue on GitHub
- Read Next.js docs: https://nextjs.org/docs

Happy coding! 🎵
