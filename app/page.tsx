import Image from "next/image";
import DoublyLinkedListComponent from "./components/doublyLinkedListComponent";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-neutral-300">
            <DoublyLinkedListComponent />
        </main>
  );
}
