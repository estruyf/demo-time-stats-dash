import { NR_OF_DAYS } from "@/App";

export interface StatsCount {
  webPageViews?: number;
  installCount?: number;
  webDownloadCount?: number;
  uninstallCount?: number;
  averageRating?: number;
}

export interface DailyStat {
  version: string | null;
  statisticDate: string;
  counts: StatsCount;
}

export interface ExtensionStats {
  extensionName: string;
  publisherName: string;
  statCount: number;
  dailyStats: DailyStat[];
}

export interface Extension {
  extensionName: string;
  displayName: string;
  shortDescription?: string;
}

export interface MarketplaceExtension {
  extensionId: string;
  extensionName: string;
  displayName: string;
  shortDescription?: string;
  publisher: {
    publisherName: string;
    displayName: string;
  };
}

export interface MarketplaceResponse {
  results: Array<{
    extensions: MarketplaceExtension[];
  }>;
}

export interface ExtensionInfo {
  installs: number;
  averageRating: number;
  ratingCount: number;
}

// Mock extensions for development
const MOCK_ELIO_EXTENSIONS: Extension[] = [
  { extensionName: "vscode-demo-time", displayName: "Demo Time" },
  { extensionName: "vscode-front-matter", displayName: "Front Matter CMS" },
  { extensionName: "vscode-helpers", displayName: "VSCode Helpers" },
  { extensionName: "vscode-file-type-icons", displayName: "File Type Icons" },
  { extensionName: "vscode-projects-manager", displayName: "Projects Manager" },
  { extensionName: "vscode-squash-commits", displayName: "Squash Commits" },
  { extensionName: "vscode-twitter", displayName: "Twitter" },
  { extensionName: "doctor", displayName: "Doctor" },
  { extensionName: "vscode-spot-images", displayName: "Spot Images" },
  { extensionName: "vscode-github-script", displayName: "GitHub Script" },
  { extensionName: "chatgpt-copilot", displayName: "ChatGPT Copilot" },
  { extensionName: "vscode-beta-ui", displayName: "Beta UI" },
  { extensionName: "vscode-media-preview", displayName: "Media Preview" },
  { extensionName: "vscode-theme-generator", displayName: "Theme Generator" },
  {
    extensionName: "vscode-json-autocomplete",
    displayName: "JSON Autocomplete",
  },
];

export const fetchPublisherExtensions = async (): Promise<Extension[]> => {
  try {
    const response = await fetch("/api/extensions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch extensions: ${response.statusText}`);
    }

    const data: Extension[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching extensions:", error);
    throw error;
  }
};

export const getMockExtensions = (): Extension[] => {
  return MOCK_ELIO_EXTENSIONS;
};

export const fetchExtensionInfo = async (
  extensionName = "vscode-demo-time",
  publisher = "eliostruyf",
): Promise<ExtensionInfo> => {
  const extId = `${publisher}.${extensionName}`;

  const response = await fetch(
    "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json;api-version=7.1-preview.1;excludeUrls=true",
      },
      body: JSON.stringify({
        assetTypes: null,
        filters: [
          {
            criteria: [
              { filterType: 8, value: "Microsoft.VisualStudio.Code" },
              { filterType: 7, value: extId },
            ],
            direction: 1,
            pageSize: 1,
            pageNumber: 1,
            sortBy: 0,
            sortOrder: 0,
            pagingToken: null,
          },
        ],
        flags: 870,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch extension info");
  }

  const data: any = await response.json();
  const extension = data?.results?.[0]?.extensions?.[0];

  if (!extension) {
    throw new Error("Extension info not found");
  }

  const getStat = (name: string) => {
    const stat = extension.statistics.find((s: any) => s.statisticName === name);
    return stat ? stat.value : 0;
  };

  return {
    installs: getStat("install"),
    averageRating: getStat("averagerating"),
    ratingCount: getStat("ratingcount"),
  };
};

export const fetchExtensionStats = async (
  extensionName = "vscode-demo-time"
): Promise<ExtensionStats> => {
  try {
    // Calculate a date 30 days ago for the stats query
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - NR_OF_DAYS);

    // Format date as ISO string and encode for URL
    const afterDateParam = encodeURIComponent(thirtyDaysAgo.toISOString());

    // Build the URL with query parameters, including the extension name
    let url = `/api/stats?aggregate=1&afterDate=${afterDateParam}&extension=${encodeURIComponent(
      extensionName
    )}`;

    const response = await fetch(url);

    if (!response.ok) {
      // Parse error response
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: response.statusText };
      }

      throw new Error(
        errorData.error || `Failed to fetch stats: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};

// Mock data for development or if API is unavailable
export const getMockStats = (
  extensionName = "vscode-demo-time"
): ExtensionStats => {
  const extension =
    MOCK_ELIO_EXTENSIONS.find((ext) => ext.extensionName === extensionName) ||
    MOCK_ELIO_EXTENSIONS[0];

  return {
    extensionName: extension.extensionName,
    publisherName: "eliostruyf",
    statCount: 31,
    dailyStats: [
      {
        version: null,
        statisticDate: "2025-07-03T00:00:00Z",
        counts: {
          webPageViews: 21,
          webDownloadCount: 6,
          uninstallCount: 1,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-07-02T00:00:00Z",
        counts: {
          webPageViews: 11,
          installCount: 4,
          webDownloadCount: 10,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-07-01T00:00:00Z",
        counts: {
          webPageViews: 9,
          installCount: 3,
          webDownloadCount: 8,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-30T00:00:00Z",
        counts: {
          webPageViews: 2,
          webDownloadCount: 6,
          uninstallCount: 1,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-29T00:00:00Z",
        counts: {
          webPageViews: 7,
          webDownloadCount: 15,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-28T00:00:00Z",
        counts: {
          webPageViews: 3,
          installCount: 3,
          webDownloadCount: 4,
          uninstallCount: 2,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-27T00:00:00Z",
        counts: {
          webPageViews: 2,
          installCount: 5,
          webDownloadCount: 21,
          uninstallCount: 2,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-26T00:00:00Z",
        counts: {
          webPageViews: 11,
          installCount: 3,
          webDownloadCount: 25,
          uninstallCount: 1,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-25T00:00:00Z",
        counts: {
          webPageViews: 8,
          installCount: 4,
          webDownloadCount: 12,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-24T00:00:00Z",
        counts: {
          webPageViews: 12,
          installCount: 5,
          webDownloadCount: 17,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-23T00:00:00Z",
        counts: {
          webPageViews: 8,
          installCount: 3,
          webDownloadCount: 6,
          uninstallCount: 1,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-22T00:00:00Z",
        counts: {
          webPageViews: 3,
          installCount: 2,
          webDownloadCount: 1,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-21T00:00:00Z",
        counts: {
          webPageViews: 5,
          installCount: 2,
          webDownloadCount: 2,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-20T00:00:00Z",
        counts: {
          webPageViews: 13,
          installCount: 5,
          webDownloadCount: 20,
          uninstallCount: 1,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-19T00:00:00Z",
        counts: {
          webPageViews: 14,
          installCount: 3,
          webDownloadCount: 9,
          uninstallCount: 1,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-18T00:00:00Z",
        counts: {
          webPageViews: 19,
          installCount: 5,
          webDownloadCount: 12,
          uninstallCount: 1,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-17T00:00:00Z",
        counts: {
          webPageViews: 19,
          installCount: 8,
          webDownloadCount: 6,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-16T00:00:00Z",
        counts: {
          webPageViews: 10,
          installCount: 5,
          webDownloadCount: 6,
          uninstallCount: 5,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-15T00:00:00Z",
        counts: {
          webPageViews: 12,
          installCount: 1,
          webDownloadCount: 1,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-14T00:00:00Z",
        counts: {
          webPageViews: 54,
          installCount: 4,
          webDownloadCount: 2,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-13T00:00:00Z",
        counts: {
          webPageViews: 7,
          installCount: 3,
          webDownloadCount: 3,
          uninstallCount: 2,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-12T00:00:00Z",
        counts: {
          webPageViews: 12,
          installCount: 9,
          webDownloadCount: 4,
          uninstallCount: 1,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-11T00:00:00Z",
        counts: {
          webPageViews: 16,
          installCount: 10,
          webDownloadCount: 8,
          uninstallCount: 1,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-10T00:00:00Z",
        counts: {
          webPageViews: 9,
          installCount: 8,
          webDownloadCount: 3,
          uninstallCount: 5,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-09T00:00:00Z",
        counts: {
          webPageViews: 8,
          installCount: 5,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-08T00:00:00Z",
        counts: {
          webPageViews: 9,
          installCount: 10,
          webDownloadCount: 4,
          uninstallCount: 1,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-07T00:00:00Z",
        counts: {
          webPageViews: 4,
          installCount: 5,
          webDownloadCount: 2,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-06T00:00:00Z",
        counts: {
          webPageViews: 3,
          installCount: 7,
          webDownloadCount: 5,
          uninstallCount: 2,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-05T00:00:00Z",
        counts: {
          webPageViews: 9,
          installCount: 2,
          webDownloadCount: 2,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-04T00:00:00Z",
        counts: {
          webPageViews: 6,
          webDownloadCount: 12,
          averageRating: 5.0,
        },
      },
      {
        version: null,
        statisticDate: "2025-06-03T00:00:00Z",
        counts: {
          webPageViews: 8,
          installCount: 11,
          webDownloadCount: 11,
          uninstallCount: 1,
          averageRating: 5.0,
        },
      },
    ],
  };
};
