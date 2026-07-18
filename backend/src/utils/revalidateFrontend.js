// Tells the Next.js storefront to drop its cached copy of these pages so
// admin edits (product/category changes) show up immediately instead of
// waiting for the page's normal ISR revalidation window.
async function revalidateFrontend(paths) {
  const url = process.env.FRONTEND_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!url || !secret) return;

  try {
    await fetch(`${url}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, paths }),
    });
  } catch (err) {
    console.error('Frontend revalidation failed:', err.message);
  }
}

module.exports = revalidateFrontend;
