import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/src/lib/auth";

/**
 * API Proxy Route
 * Forwards client requests to the backend API and attaches JWT token from NextAuth session
 * Usage: /api/proxy/admins -> http://localhost:5000/api/v1/admins
 */

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const params = await context.params;
  return proxyRequest(request, params.path);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const params = await context.params;
  return proxyRequest(request, params.path);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const params = await context.params;
  return proxyRequest(request, params.path);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const params = await context.params;
  return proxyRequest(request, params.path);
}

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[] | undefined,
) {
  try {
    // Validate path segments
    if (!pathSegments || pathSegments.length === 0) {
      return NextResponse.json({ error: "Invalid API path" }, { status: 400 });
    }

    // Get the session to access JWT token (server-side)
    const session = await getServerSession(authOptions);

    console.log("[Proxy] Session:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      hasAccessToken: !!(session as any)?.accessToken,
      tokenPreview: (session as any)?.accessToken?.substring(0, 20) + "...",
    });

    const backendBaseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const backendUrl = `${backendBaseUrl}/${pathSegments.join("/")}${request.nextUrl.search}`;

    const headers: Record<string, string> = {};

    // Copy over custom headers (like x-admin-setup-key) - but skip content-type
    request.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey !== "host" &&
        lowerKey !== "content-length" &&
        lowerKey !== "connection" &&
        lowerKey !== "content-type"
      ) {
        headers[key] = value;
      }
    });

    // Always set Content-Type for JSON requests
    headers["Content-Type"] = "application/json";

    // Add JWT token if session exists
    if (session?.user) {
      const token = (session as any).accessToken;
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
        console.log("[Proxy] Added Authorization header with token");
      } else {
        console.warn("[Proxy] Session exists but no accessToken found");
      }
    } else {
      console.warn(
        "[Proxy] No session found - request will be unauthenticated",
      );
    }

    const body =
      request.method !== "GET" && request.method !== "DELETE"
        ? await request.text()
        : undefined;

    console.log("[Proxy] Request:", {
      method: request.method,
      url: backendUrl,
      hasAuth: !!headers["Authorization"],
    });

    const backendResponse = await fetch(backendUrl, {
      method: request.method,
      headers,
      body,
    });

    const responseBody = await backendResponse.text();

    return new NextResponse(responseBody, {
      status: backendResponse.status,
      headers: {
        "Content-Type":
          backendResponse.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      {
        error: "Proxy request failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
