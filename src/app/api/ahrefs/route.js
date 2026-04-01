export async function GET() {
  try {
    const upstreamUrl = "https://analytics.ahrefs.com/analytics.js";
    const upstreamRes = await fetch(upstreamUrl, {
      next: { revalidate: 60 * 60 * 24 * 30 }, // 30 days
    });

    if (!upstreamRes.ok) {
      return new Response("Upstream error", { status: upstreamRes.status });
    }

    const body = await upstreamRes.text();
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable, stale-while-revalidate=86400",
      },
    });
  } catch (e) {
    return new Response("Server error", { status: 500 });
  }
}


