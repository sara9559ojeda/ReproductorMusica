import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const TOKEN_URL = "https://accounts.spotify.com/api/token";

export async function GET() {
    const refreshToken = (await cookies()).get("spotify_refresh_token")?.value;

    if (!refreshToken) {
        return NextResponse.json({ error: "No hay refresh token disponible" }, { status: 401 });
    }

    const authOptions = new URLSearchParams();
    authOptions.append("grant_type", "refresh_token");
    authOptions.append("refresh_token", refreshToken);
    authOptions.append("client_id", CLIENT_ID);
    authOptions.append("client_secret", CLIENT_SECRET);

    try {
        const response = await fetch(TOKEN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: authOptions.toString(),
        });

        if (!response.ok) throw new Error("Error al renovar el token");

        const data = await response.json();

        // Actualizar el nuevo access token en cookies
        const responseHeaders = new Headers();
        responseHeaders.append(
            "Set-Cookie",
            `spotify_access_token=${data.access_token}; Path=/; HttpOnly; Secure; Max-Age=${data.expires_in}`
        );

        return new NextResponse(JSON.stringify({ access_token: data.access_token }), {
            status: 200,
            headers: responseHeaders,
        });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
