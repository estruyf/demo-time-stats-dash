# VS Code Extension Stats Dashboard

A beautiful dashboard for visualizing VS Code extension statistics from the Marketplace API.

## Features

- View page views, installs, downloads, and uninstalls over time
- Compare weekly trends with previous periods
- Interactive chart visualization
- Detailed daily statistics table
- Support for real API data or mock data for development

## Cloudflare Deployment

This application is designed to run on Cloudflare Pages and Cloudflare Functions for the API layer.

### Prerequisites

1. Install Cloudflare Wrangler:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Make sure you have a Cloudflare account and have set up a site/zone.

### Deployment Steps

1. Update the `wrangler.toml` file with your Cloudflare zone details:
```toml
name = "vs-code-extension-stats"
compatibility_date = "2023-05-18"

[routes]
pattern = "/api/stats"
zone_name = "your-zone-name.com" # Replace with your zone

[site]
bucket = "./dist"
entry-point = "."
```

2. Build the application:
```bash
npm run build
```

3. Deploy to Cloudflare:
```bash
npx wrangler publish
```

4. Once deployed, you can access your application at the provided Cloudflare URL.

### Environment Variables

No environment variables are required for this application to function. All configuration is handled client-side.

### API Security

The VS Code Marketplace PAT token is:

- Never stored on the server
- Only temporarily passed through the API function
- Stored client-side using the application's key-value storage

## Development

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. The application will be available at http://localhost:3000

## Using the Dashboard

1. Access the deployed application
2. Toggle between mock data and real API data
3. To use real data, enter your VS Code Marketplace PAT token
4. Explore the statistics across different metrics and time periods