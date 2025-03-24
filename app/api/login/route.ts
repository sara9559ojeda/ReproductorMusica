import { NextResponse } from "next/server";

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
const SCOPES = "user-read-private user-read-email playlist-modify-private playlist-modify-public";

export async function GET() {
    console.log("ENV:", process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI);
    if (!CLIENT_ID || !REDIRECT_URI) {
        return NextResponse.json({ error: "Faltan variables de entorno" }, { status: 500 });
    }

    const authUrl = `${SPOTIFY_AUTH_URL}?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(SCOPES)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    
    return NextResponse.redirect(authUrl);
}
