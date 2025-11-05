# Setlist Visualizer

A beautiful, delightful way to view your concert history from Setlist.fm.

## Features

- 🎵 View your personal concert timeline in reverse chronological order
- 🎤 Beautiful, detailed setlist views
- 📱 Fully responsive design
- 🔗 Share individual setlists via direct links
- ⚡ Fast performance with intelligent caching

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Hosting**: Vercel (free tier)
- **API**: Setlist.fm API v1.0

## Getting Started

### Prerequisites

- Node.js 18+
- A Setlist.fm API key ([get one here](https://api.setlist.fm/docs/1.0/index.html))

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```

4. Add your Setlist.fm API key to `.env.local`:
   ```
   SETLISTFM_API_KEY=your_actual_api_key_here
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── setlist/[id]/      # Setlist detail pages
│   ├── user/[username]/   # User timeline pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/                   # Utilities and services
│   ├── cache.ts          # In-memory cache
│   ├── rate-limiter.ts   # API rate limiting
│   └── setlistfm-client.ts # API client
└── types/                 # TypeScript types
```

## Deployment

### Deploy to Vercel (Recommended)

This project is optimized for Vercel's free tier:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   - Add `SETLISTFM_API_KEY` in the Environment Variables section
   - Get your API key from [Setlist.fm API](https://api.setlist.fm/docs/1.0/index.html)

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at `your-app.vercel.app`

### Environment Variables

Required:
- `SETLISTFM_API_KEY` - Your Setlist.fm API key

Optional (for Redis caching):
- `UPSTASH_REDIS_REST_URL` - Upstash Redis URL
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis token

See [`docs/REDIS_MIGRATION.md`](./docs/REDIS_MIGRATION.md) for Redis setup.

## API Rate Limits

The Setlist.fm API has the following limits:
- **2 queries per second** (official limit)
- **1000 calls per day** (official limit)

This app implements:
- ✅ **Conservative rate limiting**: 1 qps (slower than API limit to ensure reliability)
- ✅ **Sequential requests**: Waits for each request to complete before starting next
- ✅ **Caching**: User concerts cached for 1 hour
- ✅ **Caching**: Setlists cached for 24 hours
- ✅ **Smart pagination**: Fetches all pages efficiently

**Note**: First page load may take a few seconds for users with many concerts (1 second per ~20 concerts). Subsequent loads are instant due to caching!

## Performance

- **Target**: 2-3 second median page load time
- **Optimization**: Server-side caching reduces API calls by ~90%
- **Mobile**: Fully responsive with optimized mobile experience
- **SEO**: Server-side rendering for all pages

## Caching Strategy

**MVP (Current)**: In-memory caching
- Simple, zero-config
- Perfect for low-traffic MVP
- No external dependencies

**Production (Recommended)**: Redis caching
- Persistent across deployments
- Shared across server instances
- See [`docs/REDIS_MIGRATION.md`](./docs/REDIS_MIGRATION.md)

## Features Roadmap

### MVP (v0.1) ✅
- [x] Username input and validation
- [x] Personal concert timeline
- [x] Year filtering
- [x] Individual setlist view
- [x] Guest access via direct links
- [x] Responsive design
- [x] Ghost UI loading states

### Future Enhancements
- [ ] Setlist image generation
- [ ] User statistics dashboard
- [ ] Social sharing integrations
- [ ] "Edit on Setlist.fm" links
- [ ] Shareable timeline URLs
- [ ] Concert photos integration
- [ ] Album art integration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
