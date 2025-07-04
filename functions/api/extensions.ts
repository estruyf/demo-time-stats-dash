// Cloudflare Function to fetch all extensions from eliostruyf publisher
interface Env {
  VSCODE_MARKETPLACE_PAT?: string;
}

export const onRequest = async (context: any) => {
  try {
    const pat = context.env?.VSCODE_MARKETPLACE_PAT || "";

    // Validate PAT token exists
    if (!pat) {
      return new Response(JSON.stringify({ error: "PAT token is required" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build the request payload based on the provided curl command
    const requestBody = {
      flags: 866,
      filters: [
        {
          criteria: [
            { filterType: 18, value: "eliostruyf" }, // Publisher name
            { filterType: 8, value: "Microsoft.VisualStudio.Code" }, // VS Code target
            { filterType: 12, value: "37889" }, // Some flag
          ],
          sortBy: 4,
          pageSize: 50, // Increase page size to get all extensions
          pageNumber: 1,
        },
      ],
      assetTypes: ["Microsoft.VisualStudio.Services.Icons.Default"],
    };

    // Make the request to the VS Code Marketplace API
    const response = await fetch(
      "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery",
      {
        method: "POST",
        headers: {
          accept: "application/json;api-version=7.2-preview.1;excludeUrls=true",
          "content-type": "application/json",
          authorization: `Basic ${btoa(":" + pat)}`,
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: "Failed to fetch extensions from VS Code Marketplace",
          status: response.status,
          statusText: response.statusText,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();

    // Transform the response to our simplified Extension interface
    const extensions = data.results[0]?.extensions?.map((ext: any) => ({
      extensionName: ext.extensionName,
      displayName: ext.displayName,
      shortDescription: ext.shortDescription,
    })) || [];

    return new Response(JSON.stringify(extensions), {
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
