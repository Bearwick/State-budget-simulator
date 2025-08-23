import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const body = {
    query: [
      {
        code: "Tid",
        selection: { filter: "item", values: ["2025"] }
      }
    ],
    response: { format: "json-stat2" }
  };

  try {
    const response = await fetch('https://data.ssb.no/api/v0/no/table/10487', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    res.status(200).json(json);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch budget data' });
  }
}