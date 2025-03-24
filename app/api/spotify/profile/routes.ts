import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const accessToken = (await cookies()).get("spotify_access_token")?.value;

    if (!accessToken) {
        return NextResponse.json({ error: "Token de acceso no encontrado" }, { status: 401 });
    }

    try {
        const response = await fetch("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
            throw new Error("Error al obtener la información del usuario");
        }

        const userData = await response.json();
        return NextResponse.json(userData);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

