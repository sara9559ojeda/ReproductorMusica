"use client";

import { useState, useRef } from "react";
import { DoublyLinkedList } from "../utils/doublyLinkedList";

export default function MusicPlayer() {
    const [list] = useState(new DoublyLinkedList<{ url: string; name: string }>());
    const [songs, setSongs] = useState<{ url: string; name: string }[]>([]);
    const [currentSong, setCurrentSong] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const [insertPosition, setInsertPosition] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const draggedIndex = useRef<number | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, mode: "start" | "end" | "position") => {
        const files = event.target.files;
        if (files) {
            const newSongs = Array.from(files).map(file => ({
                url: URL.createObjectURL(file),
                name: file.name
            }));

            if (mode === "start") {
                newSongs.reverse().forEach(song => list.prepend(song));
            } else if (mode === "position") {
                newSongs.forEach(song => list.insert(song, insertPosition));
            } else {
                newSongs.forEach(song => list.append(song));
            }

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
        <div className="flex flex-col items-center gap-6 p-8 border rounded-2xl shadow-2xl max-w-2xl mx-auto my-12 bg-white/10 backdrop-blur-lg text-neutral-100">
           
            <div className="flex flex-wrap justify-center gap-4">
                <div className="flex gap-2">
                    <input type="file" multiple accept="audio/*" onChange={(e) => handleFileUpload(e, "end")} className="hidden" id="fileUpload" />
                    <label htmlFor="fileUpload" className="px-4 py-2 rounded-lg text-neutral-200 font-medium transition duration-200 shadow-md bg-neutral-700 hover:bg-neutral-600 cursor-pointer">
                        {songs.length > 0 ? "Add more songs" : "Select songs"}
                    </label>
                </div>
    
                <div className="flex gap-2">
                    <input type="file" multiple accept="audio/*" onChange={(e) => handleFileUpload(e, "start")} className="hidden" id="fileUploadStart" />
                    <label htmlFor="fileUploadStart" className="px-4 py-2 rounded-lg text-neutral-200 font-medium transition duration-200 shadow-md bg-neutral-700 hover:bg-neutral-600 cursor-pointer">
                        Add to Start
                    </label>
                </div>
    
                <div className="flex items-center gap-2">
                    <input type="number" value={insertPosition} onChange={(e) => setInsertPosition(parseInt(e.target.value) || 0)} min="0" max={songs.length} className="w-16 bg-white/10 text-neutral-100 border border-white/20 px-2 py-1 rounded-md text-center shadow-md" />
                    <input type="file" multiple accept="audio/*" onChange={(e) => handleFileUpload(e, "position")} className="hidden" id="fileUploadPosition" />
                    <label htmlFor="fileUploadPosition" className="px-4 py-2 rounded-lg text-neutral-200 font-medium transition duration-200 shadow-md bg-neutral-700 hover:bg-neutral-600 cursor-pointer">
                        Add at Position
                    </label>
                </div>
    
                {songs.length > 0 && (
                    <button onClick={handleClearAll} className="px-4 py-2 rounded-lg text-neutral-200 font-medium transition duration-200 shadow-md bg-neutral-800 hover:bg-neutral-700">
                        Remove All
                    </button>
                )}
            </div>
    
           
            <div className="w-full max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-800 rounded-lg p-2 bg-white/10 shadow-inner">
                <ul className="w-full">
                    {songs.map((song, index) => (
                        <li key={index} className="flex items-center my-2 justify-between border-b border-neutral-600 py-3 px-2 cursor-pointer bg-white/10 hover:bg-white/20 transition duration-200 rounded-lg shadow-md"
                            draggable="true" onDragStart={() => handleDragStart(index)} onDragOver={handleDragOver} onDrop={() => handleDrop(index)}>
                            <span className="truncate w-40 pl-4">{song.name}</span>
                            <div className="flex gap-2 mx-2">
                                <button onClick={() => playSong(index)} className="px-3 py-1 rounded-lg text-neutral-200 font-medium transition duration-200 shadow-md bg-neutral-700 hover:bg-neutral-600">
                                    Play
                                </button>
                                <button onClick={() => handleRemove(index)} className="px-3 py-1 rounded-lg text-neutral-200 font-medium transition duration-200 shadow-md bg-neutral-800 hover:bg-neutral-700">
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
    
          
            {currentSong && (
                <div className="flex flex-col items-center mt-4 w-full">
                    <h3 className="text-lg font-semibold text-white">Now Playing</h3>
                    <audio ref={audioRef} controls className="w-full mt-2 rounded-lg shadow-md" />
                    <div className="flex gap-4 mt-4">
                        <button onClick={playPrev} className="px-5 py-2 rounded-lg text-neutral-200 font-medium transition duration-200 shadow-md bg-neutral-700 hover:bg-neutral-600">
                            ﹤﹤
                        </button>
                        <button onClick={playNext} className="px-5 py-2 rounded-lg text-neutral-200 font-medium transition duration-200 shadow-md bg-neutral-700 hover:bg-neutral-600">
                            ﹥﹥
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
    
    
    
    
}
