import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import * as cheerio from 'cheerio';

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0'
];

const BLOCKED_DOMAINS = [
  'youtube.com', 'youtu.be', 'tiktok.com', 'instagram.com', 'facebook.com',
  'twitter.com', 'x.com', 'pinterest.com', 'reddit.com', 'quora.com'
];

async function search(query: string, engine: 'ddg' | 'bing'): Promise<any[]> {
  try {
    const ua = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    const url = engine === 'ddg'
      ? `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
      : `https://www.bing.com/search?q=${encodeURIComponent(query)}`;

    const { data } = await axios.get(url, { headers: { 'User-Agent': ua }, timeout: 5000 });
    const $ = cheerio.load(data);
    const results: any[] = [];

    if (engine === 'ddg') {
      $('.result').each((i, el) => {
        const title = $(el).find('.result__title').text() || $(el).find('a.result__a').text();
        const snippet = $(el).find('.result__snippet').text();
        const link = $(el).find('a.result__a').attr('href');
        if (title && snippet && link) results.push({ title, snippet, link });
      });
    } else {
      $('.b_algo').each((i, el) => {
        const title = $(el).find('h2').text();
        const snippet = $(el).find('.b_caption p').text() || $(el).find('.b_algo_snippet').text();
        const link = $(el).find('a').attr('href');
        if (title && snippet && link) results.push({ title, snippet, link });
      });
    }
    return results;
  } catch (e) {
    return [];
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const { queries } = req.body;
  if (!queries || !Array.isArray(queries)) return res.status(400).json({ error: 'Invalid queries' });

  try {
    let allResults = [];
    for (const query of queries) {
      let res = await search(query, 'ddg');
      if (res.length === 0) res = await search(query, 'bing');
      allResults.push(...res);
      if (allResults.length > 15) break;
    }

    const filtered = allResults.filter(item => {
      const link = item.link.toLowerCase();
      return !BLOCKED_DOMAINS.some(domain => link.includes(domain)) && item.snippet.length > 20;
    });

    const unique = Array.from(new Map(filtered.map(item => [item.title, item])).values());
    return res.status(200).json(unique);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
