import { useEffect, useState } from 'react';

const ACCOUNT_ID = '2649926079001';
const PLAYER_ID = 'uQAZY5eLyL';

function buildEmbedUrl(playlistId, videoId) {
  const params = new URLSearchParams({ playlistId });
  if (videoId) {
    params.set('videoId', videoId);
  }
  return `https://players.brightcove.net/${ACCOUNT_ID}/${PLAYER_ID}_default/index.html?${params.toString()}`;
}

export default function TeamProcessVideo({ teamSlug, playlistId, videos }) {
  const [nowPlaying, setNowPlaying] = useState(videos[0]?.name ?? '');
  const [activeVideoId, setActiveVideoId] = useState(videos[0]?.id ?? null);
  const [embedUrl, setEmbedUrl] = useState(() => buildEmbedUrl(playlistId, videos[0]?.id));
  const showScroller = videos.length > 1;

  useEffect(() => {
    setNowPlaying(videos[0]?.name ?? '');
    setActiveVideoId(videos[0]?.id ?? null);
    setEmbedUrl(buildEmbedUrl(playlistId, videos[0]?.id));
  }, [teamSlug, playlistId, videos]);

  const playVideo = (index) => {
    const item = videos[index];
    if (!item) {
      return;
    }
    setNowPlaying(item.name);
    setActiveVideoId(item.id);
    setEmbedUrl(buildEmbedUrl(playlistId, item.id));
  };

  return (
    <div className="team-process-video">
      <div
        id="aplp-video-outer-wrapper"
        data-media-type="playlist"
        data-media-id={playlistId}
      >
        <div id="aplp-video-inner-wrapper">
          <iframe
            key={embedUrl}
            title={`${teamSlug} investment process video`}
            src={embedUrl}
            className="aplp-video-iframe"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
        </div>
      </div>

      {showScroller && (
        <div id="video-scroller">
          <div className="loading-complete">
            <div id="now-playing">
              Now Playing: <span className="video-title">{nowPlaying}</span>
            </div>
            <div id="chapters" className="disable-scroller">
              <ul id="playlist">
                {videos.map((item, index) => (
                  <li
                    key={item.id}
                    data-id={item.id}
                    className={activeVideoId === item.id ? 'active' : ''}
                    onClick={() => playVideo(index)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        playVideo(index);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <img src={item.poster} alt={item.name} className="img-fluid" />
                    <span className="display-name">{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
