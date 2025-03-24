"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                let response = await fetch("/api/spotify/profile");

                if (response.status === 401) {
                    // Si el token expiró, intentar refrescarlo
                    await fetch("/api/refresh");
                    response = await fetch("/api/spotify/profile");
                }

                if (!response.ok) {
                    throw new Error("Error al obtener el perfil");
                }

                const data = await response.json();
                setUser(data);
            } catch (err) {
                setError((err as Error).message);
            }
        };

        fetchUserProfile();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Perfil de Spotify</h1>
            {error && <p className="text-red-500">{error}</p>}
            {user ? (
                <div className="mt-4">
                    <p><strong>Nombre:</strong> {user.display_name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <img src={user.images?.[0]?.url} alt="Avatar" className="w-32 rounded-full mt-2" />
                </div>
            ) : (
                <p>Cargando...</p>
            )}
        </div>
    );
}
