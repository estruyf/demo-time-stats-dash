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

export const fetchExtensionStats = async (): Promise<ExtensionStats> => {
  try {
    // Calculate a date 30 days ago for the stats query
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Format date as ISO string and encode for URL
    const afterDateParam = encodeURIComponent(thirtyDaysAgo.toISOString());

    // Build the URL with query parameters
    let url = `/api/stats?aggregate=1&afterDate=${afterDateParam}`;

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
export const getMockStats = (): ExtensionStats => {
  return {
    extensionName: "vscode-demo-time",
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
