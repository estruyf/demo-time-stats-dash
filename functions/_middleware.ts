// Middleware for Cloudflare Functions
export const onRequest = async ({ request, next }: any) => {
  // Add CORS headers to allow API calls from any origin
  const response = await next();
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };

  // Add the headers to the response
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
};