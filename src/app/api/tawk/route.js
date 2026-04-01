export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const p = searchParams.get("p"); // property id
    const w = searchParams.get("w"); // widget id

    if (!p || !w) {
      return new Response("Missing parameters", { status: 400 });
    }

    const upstreamUrl = `https://embed.tawk.to/${encodeURIComponent(p)}/${encodeURIComponent(w)}`;
    const upstreamRes = await fetch(upstreamUrl, {
      // Let Next.js edge/cache store it too
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
        // Long-lived client and CDN cache
        "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable, stale-while-revalidate=86400",
      },
    });
  } catch (e) {
    return new Response("Server error", { status: 500 });
  }
}


