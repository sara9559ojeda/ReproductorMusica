
"use client";

import { useState } from "react";
import { DoublyLinkedList } from "../utils/doublyLinkedList";

export default function DoublyLinkedListComponent() {
    const [list] = useState(new DoublyLinkedList());
    const [values, setValues] = useState<number[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [indexValue, setIndexValue] = useState("");

    const handleAddEnd = () => {
        const num = parseInt(inputValue);
        if (!isNaN(num)) {
            list.append(num);
            setValues([...list.printList()]);
        }
        setInputValue("");
    };

    const handleAddStart = () => {
        const num = parseInt(inputValue);
        if (!isNaN(num)) {
            list.prepend(num);
            setValues([...list.printList()]);
        }
        setInputValue("");
    };

    const handleInsert = () => {
        const num = parseInt(inputValue);
        const index = parseInt(indexValue);
        if (!isNaN(num) && !isNaN(index)) {
            list.insert(num, index);
            setValues([...list.printList()]);
        }
        setInputValue("");
        setIndexValue("");
    };

    const handleRemove = () => {
        const index = parseInt(indexValue);
        if (!isNaN(index)) {
            list.remove(index);
            setValues([...list.printList()]);
        }
        setIndexValue("");
    };

    const handleClear = () => {
        list.head = null;
        list.tail = null;
        list.length = 0;
        setValues([]);
    };

    return (
        <div className="flex flex-col items-center gap-4 p-6 border rounded-lg shadow-md max-w-md mx-auto mt-10 bg-white">
            <h2 className="text-xl font-semibold">Lista</h2>
            
        
            <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="border px-2 py-1 rounded"
                placeholder="Valor"/>

           
            <input
                type="number"
                value={indexValue}
                onChange={(e) => setIndexValue(e.target.value)}
                className="border px-2 py-1 rounded"
                placeholder="Índice "/>

           
            <div className="grid grid-cols-2 gap-2">
                <button onClick={handleAddEnd} className="bg-blue-500 text-white px-4 py-2  ">
                    Agregar al Final
                </button>
                <button onClick={handleAddStart} className="bg-indigo-500 text-white px-4 py-2  ">
                    Agregar al Inicio
                </button>
                <button onClick={handleInsert} className="bg-green-500 text-white px-4 py-2  ">
                    Insertar en índice
                </button>
                <button onClick={handleRemove} className="bg-red-500 text-white px-4 py-2 ">
                    Eliminar en indice
                </button>
                <button onClick={handleClear} className="bg-gray-500 text-white px-4 py-2  ">
                    Limpiar Lista
                </button>
            </div>

         
            <div className="text-lg font-medium">Lista: {values.length > 0 ? values.join(" ⇄ ") : "Vacía"}</div>
        </div>
    );
}
