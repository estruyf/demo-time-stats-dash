// Cloudflare Function to proxy requests to VS Code Marketplace API
interface Env {
  // Environment variables if needed
}

export const onRequest = async (context: any) => {
  try {
    // Get query parameters
    const { searchParams } = new URL(context.request.url);
    const aggregate = searchParams.get("aggregate") || "1";
    const afterDate = searchParams.get("afterDate") || "";
    const pat = context.env?.VSCODE_MARKETPLACE_PAT || "";

    // Validate PAT token exists if not using mock data
    if (!pat) {
      return new Response(JSON.stringify({ error: "PAT token is required" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build the Marketplace API URL
    const apiUrl = `https://marketplace.visualstudio.com/_apis/gallery/publishers/eliostruyf/extensions/vscode-demo-time/stats?aggregate=${aggregate}&afterDate=${afterDate}`;

    // Make the request to the VS Code Marketplace API
    const response = await fetch(apiUrl, {
      headers: {
        accept: "application/json;api-version=7.2-preview.1;excludeUrls=true",
        authorization: `Basic ${btoa(":" + pat)}`,
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: "Failed to fetch stats from VS Code Marketplace",
          status: response.status,
          statusText: response.statusText,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Return the data from the Marketplace API
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API error:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
