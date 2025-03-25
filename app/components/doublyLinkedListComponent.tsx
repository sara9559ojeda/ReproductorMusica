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

    const playNext = () => {
        if (currentIndex !== null && currentIndex < list.length - 1) {
            playSong(currentIndex + 1);
        }
    };

    const playPrev = () => {
        if (currentIndex !== null && currentIndex > 0) {
            playSong(currentIndex - 1);
        }
    };

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
        <div className="flex flex-col items-center gap-6 p-8 border rounded-2xl shadow-lg max-w-2xl mx-auto my-12 bg-neutral-900 text-neutral-100">
            <h2 className="text-2xl font-bold">StereoTime</h2>
            <div className="flex">
                <input
                    type="file"
                    multiple
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="fileUpload" />
                <label
                    htmlFor="fileUpload"
                    className="border border-neutral-700 px-4 py-2 rounded-lg bg-neutral-800 text-neutral-100 hover:bg-neutral-700 transition duration-200 cursor-pointer">
                    {songs.length > 0 ? "Add more songs" : "Select songs"}
                </label>
                {songs.length > 0 && (
                    <button
                        onClick={handleClearAll}
                        className="flex bg-purple-950 text-white ml-7 px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200">
                        Remove All
                    </button>
                )}
            </div>
            <div className="w-full max-h-50 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-800">
                <ul className="w-full">
                    {songs.map((song, index) => (
                        <li
                            key={index}
                            className="flex items-center my-2 justify-between border-b border-neutral-700 py-3 px-2 cursor-pointer bg-neutral-800 hover:bg-neutral-700 transition duration-200 rounded-lg"
                            draggable="true"
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(index)}>
                            <span className="truncate w-40 pl-4">{song.name}</span>
                            <div className="flex gap-2 mx-2">
                                <button
                                    onClick={() => playSong(index)}
                                    className="bg-purple-400 text-white px-3 py-1 rounded-lg hover:bg-purple-500 transition duration-200">
                                    Play
                                </button>
                                <button
                                    onClick={() => handleRemove(index)}
                                    className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-900 transition duration-200">
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>


            {currentSong && (
                <div className="flex flex-col items-center ">
                    <h3 className="text-lg font-semibold">Now Playing</h3>
                    <audio ref={audioRef} controls className="w-full mx-40 mt-2 " />
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={playPrev}
                            className="bg-neutral-700 text-white px-5 py-2 rounded-lg hover:bg-purple-500 transition duration-200">
                            ﹤﹤
                        </button>
                        <button
                            onClick={playNext}
                            className="bg-neutral-700 text-white px-5 py-2 rounded-lg hover:bg-purple-500 transition duration-200">
                            ﹥﹥
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
