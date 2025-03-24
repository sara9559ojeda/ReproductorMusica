import { NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!;
const TOKEN_URL = "https://accounts.spotify.com/api/token";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
        return NextResponse.json({ error: "Código de autorización no proporcionado" }, { status: 400 });
    }

    const authOptions = new URLSearchParams();
    authOptions.append("grant_type", "authorization_code");
    authOptions.append("code", code);
    authOptions.append("redirect_uri", REDIRECT_URI);
    authOptions.append("client_id", CLIENT_ID);
    authOptions.append("client_secret", CLIENT_SECRET);

    try {
        const response = await fetch(TOKEN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: authOptions.toString(),
        });

        if (!response.ok) throw new Error("Error al intercambiar el código por tokens");

        const data = await response.json();

        // Guardar tokens en cookies
        const responseHeaders = new Headers();
        responseHeaders.append(
            "Set-Cookie",
            `spotify_access_token=${data.access_token}; Path=/; HttpOnly; Secure; Max-Age=${data.expires_in}`
        );
        responseHeaders.append(
            "Set-Cookie",
            `spotify_refresh_token=${data.refresh_token}; Path=/; HttpOnly; Secure; Max-Age=31536000`
        );

        return new NextResponse(JSON.stringify({ success: true }), { status: 200, headers: responseHeaders });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
