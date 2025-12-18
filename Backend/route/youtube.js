// route/youtube.js
import express from 'express';

const router = express.Router();
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

router.get('/youtube-search', async (req, res) => {
  const q = (req.query.q || '').trim();

  if (!q || !YOUTUBE_API_KEY) {
    return res.json({ items: [] });
  }

  try {
    const params = new URLSearchParams({
      part: 'snippet',
      q: `${q} asl sign language`,
      type: 'video',
      maxResults: '5',
      key: YOUTUBE_API_KEY,
    }).toString();

    const ytRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params}`
    );
    const data = await ytRes.json();

    const items = (data.items || []).map((item) => {
      const vid = item.id.videoId;
      const sn = item.snippet;
      return {
        videoId: vid,
        title: sn.title,
        channel: sn.channelTitle,
        thumbnail: sn.thumbnails?.medium?.url,
        url: `https://www.youtube.com/watch?v=${vid}`,
      };
    });

    res.json({ items });
  } catch (err) {
    console.error('YouTube API error:', err);
    res.status(500).json({ items: [] });
  }
});

export default router;
