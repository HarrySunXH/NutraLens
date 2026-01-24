# NutraLens - AI-Powered Supplement Intelligence

NutraLens is an AI-powered platform that provides personalized, science-backed supplement recommendations based on your health profile, goals, and lab results.

## Features

- **Personalized Health Profile**: Complete your health profile with age, medical conditions, health goals, lab results, and current supplements
- **AI-Powered Chat**: Get personalized supplement recommendations from our AI assistant
- **Real-Time Product Search**: AI searches the web for supplement products and provides purchase links
- **Interaction Checking**: Identify potential conflicts between supplements
- **Evidence-Based**: Recommendations backed by scientific evidence

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Required: Groq API Key for AI chat
# Get your key at: https://console.groq.com/
GROQ_API_KEY=your_groq_api_key_here

# Optional: Brave Search API Key for product search
# Get your key at: https://api.search.brave.com/
BRAVE_SEARCH_API_KEY=your_brave_search_api_key_here
```

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **AI**: Groq LLM (llama-3.3-70b-versatile)
- **Search**: Brave Search API
- **Icons**: Lucide React
- **Markdown**: react-markdown with remark-gfm

## Project Structure

```
src/
  app/
    api/
      chat/           # AI chat endpoint with streaming
      search-supplements/  # Brave Search integration
    chat/             # Chat interface page
    page.tsx          # Homepage
  components/
    chat/             # Chat UI components
    onboarding/       # Health profile onboarding
  context/
    HealthProfileContext.tsx  # User profile state
  types/
    health-profile.ts  # TypeScript interfaces
```

## API Keys Setup

### Groq API Key (Required)

1. Go to [https://console.groq.com/](https://console.groq.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Add it to your `.env.local` as `GROQ_API_KEY`

### Brave Search API Key (Optional but recommended)

1. Go to [https://api.search.brave.com/](https://api.search.brave.com/)
2. Sign up for a free account
3. Subscribe to the "Free" plan (2,000 queries/month)
4. Get your API key from the dashboard
5. Add it to your `.env.local` as `BRAVE_SEARCH_API_KEY`

Without the Brave Search API key, the AI will still provide recommendations but won't include real product links.

## License

This project is private and proprietary.
