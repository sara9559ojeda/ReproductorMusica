"use client";

import { useState, useRef } from "react";
import { DoublyLinkedList } from "../utils/doublyLinkedList";

export default function MusicPlayer() {
    const [list] = useState(new DoublyLinkedList<{ url: string; name: string }>());
    const [songs, setSongs] = useState<{ url: string; name: string }[]>([]);
    const [currentSong, setCurrentSong] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const draggedIndex = useRef<number | null>(null);

    // 📂 Agregar archivos al reproductor
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newSongs = Array.from(files).map(file => ({
                url: URL.createObjectURL(file),
                name: file.name
            }));
            newSongs.forEach(song => list.append(song));
            setSongs([...list.printList()]);
        }
    };

    // 🎵 Reproducir una canción
    const playSong = (index: number) => {
        const node = list.traverseToIndex(index);
        if (node) {
            setCurrentSong(node.value.url);
            setCurrentIndex(index);
            if (audioRef.current) {
                audioRef.current.src = node.value.url;
                audioRef.current.play();
            }
        }
    };

    // ⏭ Reproducir la siguiente canción
    const playNext = () => {
        if (currentIndex !== null && currentIndex < list.length - 1) {
            playSong(currentIndex + 1);
        }
    };

    // ⏮ Reproducir la canción anterior
    const playPrev = () => {
        if (currentIndex !== null && currentIndex > 0) {
            playSong(currentIndex - 1);
        }
    };

    // 🗑 Eliminar una canción
    const handleRemove = (index: number) => {
        list.remove(index);
        setSongs([...list.printList()]);

        if (index === currentIndex) {
            if (list.length > 0) {
                const newIndex = index < list.length ? index : list.length - 1;
                playSong(newIndex);
            } else {
                setCurrentSong(null);
                setCurrentIndex(null);
            }
        }
    };

    // 🧹 Eliminar todas las canciones
    const handleClearAll = () => {
        list.clear();
        setSongs([]);
        setCurrentSong(null);
        setCurrentIndex(null);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
        }
    };

    // 🏗 Drag and Drop
    const handleDragStart = (index: number) => {
        draggedIndex.current = index;
    };

    const handleDragOver = (event: React.DragEvent<HTMLLIElement>) => {
        event.preventDefault();
    };

    const handleDrop = (index: number) => {
        if (draggedIndex.current !== null && draggedIndex.current !== index) {
            const draggedNode = list.traverseToIndex(draggedIndex.current);
            if (draggedNode) {
                list.remove(draggedIndex.current);
                list.insert(draggedNode.value, index);
                setSongs([...list.printList()]);
                setCurrentIndex(index);
            }
        }
        draggedIndex.current = null;
    };

    return (
        <div className="flex flex-col items-center gap-4 p-6 border rounded-lg shadow-md max-w-md mx-auto mt-10 bg-white">
            <h2 className="text-xl font-semibold">🎵 Reproductor de Música</h2>
            <input type="file" multiple accept="audio/*" onChange={handleFileUpload} className="border px-2 py-1 rounded" />

            {songs.length > 0 && (
                <button onClick={handleClearAll} className="bg-red-600 text-white px-4 py-2 rounded mt-2">
                    🗑 Eliminar todas
                </button>
            )}

            <ul className="w-full">
                {songs.map((song, index) => (
                    <li key={index} className="flex items-center justify-between border-b py-2 cursor-pointer"
                        draggable="true"
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index)}
                    >
                        <span className="truncate w-32">{song.name}</span>
                        <div className="flex gap-2">
                            <button onClick={() => playSong(index)} className="bg-yellow-500 text-white px-2 py-1 rounded">▶</button>
                            <button onClick={() => handleRemove(index)} className="bg-red-500 text-white px-2 py-1 rounded">❌</button>
                        </div>
                    </li>
                ))}
            </ul>

            {currentSong && (
                <div className="flex flex-col items-center">
                    <h3 className="text-lg font-semibold">🎶 Reproduciendo:</h3>
                    <audio ref={audioRef} controls />
                    <div className="flex gap-2 mt-2">
                        <button onClick={playPrev} className="bg-yellow-500 text-white px-4 py-2 rounded">⏮ Anterior</button>
                        <button onClick={playNext} className="bg-green-500 text-white px-4 py-2 rounded">⏭ Siguiente</button>
                    </div>
                </div>
            )}
        </div>
    );
}
