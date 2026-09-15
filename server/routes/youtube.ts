import { Router, Request, Response } from "express";

const router = Router();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const YOUTUBE_API_BASE =
  "https://www.googleapis.com/youtube/v3";

/* ==========================================================================
   Types
========================================================================== */

type SearchOrder =
  | "relevance"
  | "date"
  | "rating"
  | "viewCount"
  | "title";

type SafeSearch =
  | "none"
  | "moderate"
  | "strict";

interface YouTubeThumbnail {
  url: string;
  width?: number;
  height?: number;
}

interface YouTubeSnippet {
  title?: string;
  description?: string;
  channelId?: string;
  channelTitle?: string;
  publishedAt?: string;
  liveBroadcastContent?: string;

  thumbnails?: {
    default?: YouTubeThumbnail;
    medium?: YouTubeThumbnail;
    high?: YouTubeThumbnail;
    standard?: YouTubeThumbnail;
    maxres?: YouTubeThumbnail;
  };
}

interface YouTubeStatistics {
  viewCount?: string;
  likeCount?: string;
  commentCount?: string;
}

interface YouTubeContentDetails {
  duration?: string;
  definition?: string;
  caption?: string;
}

interface YouTubeStatus {
  embeddable?: boolean;
  privacyStatus?: string;
}

interface YouTubeVideo {
  id: string;

  snippet?: YouTubeSnippet;

  statistics?: YouTubeStatistics;

  contentDetails?: YouTubeContentDetails;

  status?: YouTubeStatus;
}

interface YouTubeSearchItem {
  id?: {
    kind?: string;
    videoId?: string;
    channelId?: string;
    playlistId?: string;
  };

  snippet?: YouTubeSnippet;
}

interface YouTubeChannel {
  id: string;

  snippet?: {
    thumbnails?: {
      default?: YouTubeThumbnail;
      medium?: YouTubeThumbnail;
      high?: YouTubeThumbnail;
    };
  };
}

interface YouTubeResponse<T> {
  items?: T[];

  nextPageToken?: string;

  prevPageToken?: string;

  pageInfo?: {
    totalResults?: number;
    resultsPerPage?: number;
  };
}

/* ==========================================================================
   Cache
========================================================================== */

interface CacheEntry {
  expiresAt: number;
  data: unknown;
}

const cache =
  new Map<string, CacheEntry>();

const CACHE_TTL =
  60 * 1000;

function getCache<T>(
  key: string
): T | null {
  const item =
    cache.get(key);

  if (!item) {
    return null;
  }

  if (
    item.expiresAt <
    Date.now()
  ) {
    cache.delete(key);

    return null;
  }

  return item.data as T;
}

function setCache(
  key: string,
  data: unknown
) {
  cache.set(key, {
    data,
    expiresAt:
      Date.now() +
      CACHE_TTL,
  });

  if (cache.size > 100) {
    const firstKey =
      cache.keys().next().value;

    if (firstKey) {
      cache.delete(firstKey);
    }
  }
}

/* ==========================================================================
   YouTube API request
========================================================================== */

async function youtubeRequest<T>(
  endpoint: string,
  params: Record<
    string,
    string | number | undefined
  >
): Promise<T> {
  if (!YOUTUBE_API_KEY) {
    throw new Error(
      "YOUTUBE_API_KEY is missing from .env"
    );
  }

  const url = new URL(
    `${YOUTUBE_API_BASE}/${endpoint}`
  );

  url.searchParams.set(
    "key",
    YOUTUBE_API_KEY
  );

  Object.entries(params).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== ""
      ) {
        url.searchParams.set(
          key,
          String(value)
        );
      }
    }
  );

  const response = await fetch(
    url.toString()
  );

  const data =
    await response.json();

  if (!response.ok) {
    const message =
      data?.error?.message ||
      `YouTube API failed with ${response.status}`;

    throw new Error(message);
  }

  return data as T;
}

/* ==========================================================================
   Helpers
========================================================================== */

function bestThumbnail(
  thumbnails:
    | YouTubeSnippet["thumbnails"]
    | undefined
) {
  return (
    thumbnails?.maxres?.url ||
    thumbnails?.standard?.url ||
    thumbnails?.high?.url ||
    thumbnails?.medium?.url ||
    thumbnails?.default?.url ||
    ""
  );
}

function normalizeVideo(
  video: YouTubeVideo,
  channelThumbnail = ""
) {
  const snippet =
    video.snippet || {};

  const statistics =
    video.statistics || {};

  const content =
    video.contentDetails || {};

  const status =
    video.status || {};

  const id =
    video.id;

  return {
    id,

    title:
      snippet.title ||
      "Untitled video",

    description:
      snippet.description ||
      "",

    channelId:
      snippet.channelId ||
      "",

    channelTitle:
      snippet.channelTitle ||
      "Unknown channel",

    channelThumbnail,

    publishedAt:
      snippet.publishedAt ||
      "",

    thumbnail:
      bestThumbnail(
        snippet.thumbnails
      ),

    thumbnailMedium:
      snippet.thumbnails?.medium
        ?.url ||
      bestThumbnail(
        snippet.thumbnails
      ),

    thumbnailHigh:
      snippet.thumbnails?.high
        ?.url ||
      bestThumbnail(
        snippet.thumbnails
      ),

    duration:
      content.duration ||
      "PT0S",

    viewCount:
      Number(
        statistics.viewCount ||
          0
      ),

    likeCount:
      Number(
        statistics.likeCount ||
          0
      ),

    commentCount:
      Number(
        statistics.commentCount ||
          0
      ),

    definition:
      content.definition ||
      "",

    caption:
      content.caption ||
      "",

    liveBroadcastContent:
      snippet.liveBroadcastContent ||
      "none",

    embeddable:
      status.embeddable !== false,

    youtubeUrl:
      `https://www.youtube.com/watch?v=${id}`,

    embedUrl:
      `https://www.youtube.com/embed/${id}`,
  };
}

/* ==========================================================================
   Channel thumbnails
========================================================================== */

async function getChannelThumbnails(
  channelIds: string[]
) {
  const uniqueIds = [
    ...new Set(
      channelIds.filter(Boolean)
    ),
  ];

  if (!uniqueIds.length) {
    return new Map<
      string,
      string
    >();
  }

  const response =
    await youtubeRequest<
      YouTubeResponse<YouTubeChannel>
    >(
      "channels",
      {
        part: "snippet",

        id: uniqueIds.join(","),
      }
    );

  const result =
    new Map<
      string,
      string
    >();

  for (
    const channel of
      response.items || []
  ) {
    const thumbnail =
      channel.snippet
        ?.thumbnails
        ?.high?.url ||
      channel.snippet
        ?.thumbnails
        ?.medium?.url ||
      channel.snippet
        ?.thumbnails
        ?.default?.url ||
      "";

    result.set(
      channel.id,
      thumbnail
    );
  }

  return result;
}

/* ==========================================================================
   SEARCH
   GET /api/youtube/search
========================================================================== */

router.get(
  "/search",
  async (
    req: Request,
    res: Response
  ) => {
    try {
      if (!YOUTUBE_API_KEY) {
        res.status(503).json({
          error:
            "YOUTUBE_API_KEY is not configured.",
        });

        return;
      }

      const q =
        typeof req.query.q ===
        "string"
          ? req.query.q.trim()
          : "";

      if (!q) {
        res.status(400).json({
          error:
            "Search query is required.",
        });

        return;
      }

      const orderValues:
        SearchOrder[] = [
          "relevance",
          "date",
          "rating",
          "viewCount",
          "title",
        ];

      const requestedOrder =
        typeof req.query.order ===
        "string"
          ? req.query.order
          : "relevance";

      const order =
        orderValues.includes(
          requestedOrder as SearchOrder
        )
          ? (requestedOrder as SearchOrder)
          : "relevance";

      const safeValues:
        SafeSearch[] = [
          "none",
          "moderate",
          "strict",
        ];

      const requestedSafe =
        typeof req.query.safeSearch ===
        "string"
          ? req.query.safeSearch
          : "moderate";

      const safeSearch =
        safeValues.includes(
          requestedSafe as SafeSearch
        )
          ? (requestedSafe as SafeSearch)
          : "moderate";

      const regionCode =
        typeof req.query.regionCode ===
        "string"
          ? req.query.regionCode
              .trim()
              .toUpperCase()
          : "IN";

      const pageToken =
        typeof req.query.pageToken ===
        "string"
          ? req.query.pageToken
          : undefined;

      const requestedMax =
        Number(
          req.query.maxResults
        ) || 24;

      const maxResults =
        Math.min(
          Math.max(
            requestedMax,
            1
          ),
          50
        );

      const cacheKey =
        JSON.stringify({
          q,
          order,
          safeSearch,
          regionCode,
          pageToken,
          maxResults,
        });

      const cached =
        getCache(cacheKey);

      if (cached) {
        res.json(cached);

        return;
      }

      /* ---------------------------------------------------------------
         Search
      ---------------------------------------------------------------- */

      const searchResponse =
        await youtubeRequest<
          YouTubeResponse<YouTubeSearchItem>
        >(
          "search",
          {
            part: "snippet",

            q,

            type: "video",

            order,

            regionCode,

            safeSearch,

            videoEmbeddable:
              "true",

            maxResults,

            pageToken,
          }
        );

      const videoIds =
        (
          searchResponse.items ||
          []
        )
          .map(
            (item) =>
              item.id
                ?.videoId
          )
          .filter(
            (
              id
            ): id is string =>
              Boolean(id)
          );

      if (!videoIds.length) {
        const empty = {
          items: [],
          nextPageToken:
            searchResponse.nextPageToken,
          prevPageToken:
            searchResponse.prevPageToken,
          totalResults:
            searchResponse
              .pageInfo
              ?.totalResults || 0,
        };

        setCache(
          cacheKey,
          empty
        );

        res.json(empty);

        return;
      }

      /* ---------------------------------------------------------------
         Detailed video information
      ---------------------------------------------------------------- */

      const videoResponse =
        await youtubeRequest<
          YouTubeResponse<YouTubeVideo>
        >(
          "videos",
          {
            part:
              "snippet,contentDetails,statistics,status",

            id:
              videoIds.join(","),
          }
        );

      const videoMap =
        new Map<
          string,
          YouTubeVideo
        >();

      for (
        const video of
          videoResponse.items ||
          []
      ) {
        videoMap.set(
          video.id,
          video
        );
      }

      /* ---------------------------------------------------------------
         Channel avatars
      ---------------------------------------------------------------- */

      const channelIds =
        videoIds
          .map(
            (id) =>
              videoMap.get(id)
                ?.snippet
                ?.channelId
          )
          .filter(
            (
              id
            ): id is string =>
              Boolean(id)
          );

      const channelMap =
        await getChannelThumbnails(
          channelIds
        );

      /* ---------------------------------------------------------------
         Normalize
      ---------------------------------------------------------------- */

      const items =
        videoIds
          .map(
            (id) =>
              videoMap.get(id)
          )
          .filter(
            (
              video
            ): video is YouTubeVideo =>
              Boolean(video)
          )
          .filter(
            (video) =>
              video.status
                ?.embeddable !== false
          )
          .map(
            (video) =>
              normalizeVideo(
                video,

                channelMap.get(
                  video.snippet
                    ?.channelId ||
                    ""
                ) || ""
              )
          );

      const result = {
        items,

        nextPageToken:
          searchResponse.nextPageToken,

        prevPageToken:
          searchResponse.prevPageToken,

        totalResults:
          searchResponse
            .pageInfo
            ?.totalResults || 0,

        resultsPerPage:
          searchResponse
            .pageInfo
            ?.resultsPerPage || 0,
      };

      setCache(
        cacheKey,
        result
      );

      res.json(result);
    } catch (error) {
      console.error(
        "YouTube search error:",
        error
      );

      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "YouTube search failed.",
      });
    }
  }
);

/* ==========================================================================
   TRENDING
   GET /api/youtube/trending
========================================================================== */

router.get(
  "/trending",
  async (
    req: Request,
    res: Response
  ) => {
    try {
      if (!YOUTUBE_API_KEY) {
        res.status(503).json({
          error:
            "YOUTUBE_API_KEY is not configured.",
        });

        return;
      }

      const regionCode =
        typeof req.query.regionCode ===
        "string"
          ? req.query.regionCode
              .trim()
              .toUpperCase()
          : "IN";

      const requestedMax =
        Number(
          req.query.maxResults
        ) || 24;

      const maxResults =
        Math.min(
          Math.max(
            requestedMax,
            1
          ),
          50
        );

      const cacheKey =
        `trending:${regionCode}:${maxResults}`;

      const cached =
        getCache(cacheKey);

      if (cached) {
        res.json(cached);

        return;
      }

      const response =
        await youtubeRequest<
          YouTubeResponse<YouTubeVideo>
        >(
          "videos",
          {
            part:
              "snippet,contentDetails,statistics,status",

            chart:
              "mostPopular",

            regionCode,

            maxResults,
          }
        );

      const videos =
        (
          response.items || []
        ).filter(
          (video) =>
            video.status
              ?.embeddable !== false
        );

      const channelIds =
        videos
          .map(
            (video) =>
              video.snippet
                ?.channelId
          )
          .filter(
            (
              id
            ): id is string =>
              Boolean(id)
          );

      const channelMap =
        await getChannelThumbnails(
          channelIds
        );

      const items =
        videos.map(
          (video) =>
            normalizeVideo(
              video,

              channelMap.get(
                video.snippet
                  ?.channelId ||
                  ""
              ) || ""
            )
        );

      const result = {
        items,

        nextPageToken:
          response.nextPageToken,

        prevPageToken:
          response.prevPageToken,

        totalResults:
          response.pageInfo
            ?.totalResults || 0,

        resultsPerPage:
          response.pageInfo
            ?.resultsPerPage || 0,
      };

      setCache(
        cacheKey,
        result
      );

      res.json(result);
    } catch (error) {
      console.error(
        "YouTube trending error:",
        error
      );

      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "YouTube trending failed.",
      });
    }
  }
);

/* ==========================================================================
   SINGLE VIDEO
   GET /api/youtube/video?id=VIDEO_ID
========================================================================== */

router.get(
  "/video",
  async (
    req: Request,
    res: Response
  ) => {
    try {
      if (!YOUTUBE_API_KEY) {
        res.status(503).json({
          error:
            "YOUTUBE_API_KEY is not configured.",
        });

        return;
      }

      const id =
        typeof req.query.id ===
        "string"
          ? req.query.id.trim()
          : "";

      if (!id) {
        res.status(400).json({
          error:
            "Video ID is required.",
        });

        return;
      }

      if (
        !/^[A-Za-z0-9_-]{6,20}$/.test(
          id
        )
      ) {
        res.status(400).json({
          error:
            "Invalid YouTube video ID.",
        });

        return;
      }

      const cacheKey =
        `video:${id}`;

      const cached =
        getCache(cacheKey);

      if (cached) {
        res.json(cached);

        return;
      }

      const response =
        await youtubeRequest<
          YouTubeResponse<YouTubeVideo>
        >(
          "videos",
          {
            part:
              "snippet,contentDetails,statistics,status",

            id,
          }
        );

      const video =
        response.items?.[0];

      if (!video) {
        res.status(404).json({
          error:
            "YouTube video not found.",
        });

        return;
      }

      if (
        video.status
          ?.embeddable === false
      ) {
        res.status(403).json({
          error:
            "This video does not allow embedded playback.",
          youtubeUrl:
            `https://www.youtube.com/watch?v=${id}`,
        });

        return;
      }

      let channelThumbnail =
        "";

      if (
        video.snippet
          ?.channelId
      ) {
        const channels =
          await getChannelThumbnails([
            video.snippet
              .channelId,
          ]);

        channelThumbnail =
          channels.get(
            video.snippet
              .channelId
          ) || "";
      }

      const result =
        normalizeVideo(
          video,
          channelThumbnail
        );

      setCache(
        cacheKey,
        result
      );

      res.json(result);
    } catch (error) {
      console.error(
        "YouTube video error:",
        error
      );

      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "YouTube video failed.",
      });
    }
  }
);

export default router;