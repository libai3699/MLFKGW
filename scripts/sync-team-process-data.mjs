import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const teamSlugs = [
  'growth-team',
  'global-equity-team',
  'us-value-team',
  'sustainable-emerging-markets-team',
  'credit-team',
  'international-small-mid-team',
  'emsights-capital-group',
];

const pageMeta = {
  'growth-team': {
    title: 'Artisan Partners Growth Team Investment Process',
    playlistId: '1761719457679355272',
    strategies: [
      'Global Opportunities',
      'Global Discovery',
      'U.S. Mid-Cap Growth',
      'U.S. Small-Cap Growth',
      'Franchise',
    ],
  },
  'global-equity-team': {
    title: 'Artisan Partners Global Equity Team Investment Process',
    playlistId: '4993905167001',
    strategies: ['Global Equity', 'Non-U.S. Growth'],
  },
  'us-value-team': {
    title: 'Artisan Partners U.S. Value Team Investment Process',
    playlistId: '2919397520001',
    strategies: ['Value Equity', 'U.S. Mid-Cap Value', 'Value Income'],
  },
  'sustainable-emerging-markets-team': {
    title: 'Artisan Partners Sustainable Emerging Markets Team Investment Process',
    playlistId: '1831474383422433559',
    strategies: ['Sustainable Emerging Markets'],
  },
  'credit-team': {
    title: 'Artisan Partners Credit Team Investment Process',
    playlistId: '5502155855001',
    strategies: ['High Income', 'Credit Opportunities', 'Floating Rate'],
  },
  'international-small-mid-team': {
    title: 'Artisan Partners International Small-Mid Team Investment Process',
    playlistId: '1811834182750307417',
    strategies: ['Non-U.S. Small-Mid Growth'],
  },
  'emsights-capital-group': {
    title: 'Artisan Partners EMsights Capital Group Investment Process',
    playlistId: '1784555838090587108',
    strategies: [
      'Emerging Markets Debt Opportunities',
      'Global Unconstrained',
      'Emerging Markets Local Opportunities',
    ],
  },
};

async function getPolicyKey() {
  const response = await fetch(
    'https://players.brightcove.net/2649926079001/uQAZY5eLyL_default/index.min.js',
  );
  const playerJs = await response.text();
  const match = playerJs.match(/policyKey:"(BCpk[^"]+)"/);
  if (!match) {
    throw new Error('Could not find Brightcove policy key');
  }
  return match[1];
}

async function fetchPlaylist(playlistId, policyKey) {
  const url = `https://edge.api.brightcove.com/playback/v1/accounts/2649926079001/playlists/${playlistId}`;
  const response = await fetch(url, {
    headers: {
      'BCov-Policy': policyKey,
      Origin: 'https://www.artisanpartners.com',
      Referer: 'https://www.artisanpartners.com/',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch playlist ${playlistId}: ${response.status}`);
  }

  return response.json();
}

async function downloadPoster(url, outputPath) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
}

function escapeString(value) {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function formatVideos(videos) {
  return videos
    .map(
      (video) =>
        `      { id: '${video.id}', name: ${escapeString(video.name)}, poster: '${video.poster}' },`,
    )
    .join('\n');
}

async function main() {
  const policyKey = await getPolicyKey();
  const sections = [];

  for (const slug of teamSlugs) {
    const meta = pageMeta[slug];
    const playlist = await fetchPlaylist(meta.playlistId, policyKey);
    const videos = [];

    for (let index = 0; index < playlist.videos.length; index += 1) {
      const video = playlist.videos[index];
      const posterFile = `${index + 1}.jpg`;
      const posterPath = `/images/team-process/${slug}/${posterFile}`;
      const localPath = path.join(__dirname, '../public/images/team-process', slug, posterFile);

      await downloadPoster(video.poster, localPath);

      videos.push({
        id: video.id,
        name: video.name.trim(),
        poster: posterPath,
      });
    }

    sections.push(`  '${slug}': {
    title: ${escapeString(meta.title)},
    playlistId: '${meta.playlistId}',
    strategies: [${meta.strategies.map((item) => escapeString(item)).join(', ')}],
    videos: [
${formatVideos(videos)}
    ],
  },`);

    console.log(`${slug}: ${videos.length} videos`);
  }

  const fileContents = `export const teamProcessPages = {
${sections.join('\n')}
};

export const teamProcessSlugs = Object.keys(teamProcessPages);
`;

  fs.writeFileSync(path.join(__dirname, '../src/data/teamProcessData.js'), fileContents);
  console.log('Updated src/data/teamProcessData.js');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
