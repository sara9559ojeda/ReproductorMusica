

import Image from "next/image";
import DoublyLinkedListComponent from "./components/doublyLinkedListComponent";
import { Music } from "lucide-react";

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 to-blue-500 overflow-hidden">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.1)_0%,_rgba(0,0,0,0.2)_100%)] opacity-30 blur-2xl"></div>
      
     
      <div className="absolute top-10 left-16 w-10 h-10 bg-white/20 rounded-full blur-sm animate-bounce"></div>
      <div className="absolute top-1/3 right-10 w-16 h-16 bg-white/10 rounded-full blur-md animate-bounce delay-200"></div>
      <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white/15 rounded-full blur-md animate-bounce delay-300"></div>
      <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-white/10 rounded-full blur-sm animate-bounce delay-500"></div>
      <div className="absolute top-1/2 left-1/3 w-14 h-14 bg-white/20 rounded-full blur-sm animate-bounce delay-700"></div>

     
      <div className="flex flex-col items-center gap-4 text-white text-3xl font-bold shadow-lg p-6 rounded-lg bg-black/30 backdrop-blur-lg">
        <div className="flex items-center gap-4">
          <Music className="w-10 h-10 text-purple-400" />
          <h1 className="drop-shadow-lg">StereoTime</h1>
        </div>
        <p className="text-lg text-white/80 italic font-medium">Feel the rhythm, own the beat!</p>
      </div>

     
      <DoublyLinkedListComponent />
    </main>
  );
}


