"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchVenues } from "../../../lib/features/event/eventSlice";
//import FunctionsEditor from "./FunctionsEditor";

// Editor interno de funciones

export default function FunctionView({ value = [], onChange }) {
    const eventFunctions = useSelector(state => state.event.eventFunctions || []);
    const dispatch = useDispatch();
    const [selectedFunctionIndex, setSelectedFunctionIndex] = useState(null);

    useEffect(() => { dispatch(fetchVenues()); }, [dispatch]);

    const handleFunctionChange = (e) => {
        const val = e.target.value;
        if (val === "") {
            setSelectedFunctionIndex(null);
            onChange([]);
        } else {
            const idx = Number(val);
            setSelectedFunctionIndex(idx);
            onChange([eventFunctions[idx]]);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block mb-1 text-xs font-medium text-gray-700">Seleccionar un Venue</label>
                <select
                    className="w-full bg-white border border-gray-300 rounded p-2 text-sm"
                    value={selectedFunctionIndex !== null ? selectedFunctionIndex : ""}
                    onChange={handleFunctionChange}
                >
                    <option value="">Seleccione un venue</option>
                    {eventFunctions.map((fn, i) => (
                        <option key={i} value={i}>
                            Venue {i + 1}: {fn.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedFunctionIndex !== null && (
                <FunctionsEditor
                    value={[eventFunctions[selectedFunctionIndex]]}
                    onChange={val => {
                        const newFunctions = [...eventFunctions];
                        newFunctions[selectedFunctionIndex] = val[0];
                        onChange(newFunctions);
                    }}
                />
            )}
        </div>
    );
}