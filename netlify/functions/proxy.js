exports.handler = async (event) => {
  try {
    const rawUrl = event.queryStringParameters?.url;
    if (!rawUrl) {
      return { statusCode: 400, body: "Missing url query param" };
    }

    const parsed = new URL(rawUrl);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { statusCode: 400, body: "Invalid protocol" };
    }

    const response = await fetch(parsed.toString(), {
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        accept: "text/html,application/xhtml+xml",
      },
    });

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      return {
        statusCode: 200,
        headers: { "content-type": "text/plain; charset=utf-8" },
        body: `Non-HTML content (${contentType}). Open directly: ${parsed.toString()}`,
      };
    }

    let html = await response.text();
    const baseTag = `<base href="${parsed.origin}">`;
    if (html.includes("<head")) {
      html = html.replace(/<head[^>]*>/i, (m) => `${m}${baseTag}`);
    } else {
      html = `${baseTag}${html}`;
    }

    return {
      statusCode: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      },
      body: html,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "content-type": "text/plain; charset=utf-8" },
      body: `Proxy error: ${error.message}`,
    };
  }
};
