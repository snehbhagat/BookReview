const fetch = global.fetch;

async function warmNYT(baseUrl = 'http://localhost:4000') {
  try {
    await fetch(`${baseUrl}/api/nyt/list-names`).then(r => r.text());
    await fetch(`${baseUrl}/api/nyt/overview`).then(r => r.text());
    console.log('[Warmup] NYT list-names & overview warmed.');
  } catch (e) {
    console.warn('[Warmup] NYT warm failed:', e.message);
  }
}
module.exports = { warmNYT };