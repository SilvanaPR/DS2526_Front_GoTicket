"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchVenues } from "../../../lib/features/event/eventSlice";

const createEmptyFn = () => ({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    venue: {
        name: "",
        capacity: "",
        address: "",
        location: { country: "", city: "" }
    }
});

function deepCloneFn(fn) {
    return {
        name: fn.name ?? "",
        description: fn.description ?? "",
        startDate: fn.startDate ?? "",
        endDate: fn.endDate ?? "",
        venue: {
            name: fn.venue?.name ?? "",
            capacity: fn.venue?.capacity ?? "",
            address: fn.venue?.address ?? "",
            location: {
                country: fn.venue?.location?.country ?? "",
                city: fn.venue?.location?.city ?? ""
            }
        }
    };
}

function FunctionsEditor({ value = [], onChange }) {
    const [localFunctions, setLocalFunctions] = useState(
        value.length ? value.map(deepCloneFn) : [createEmptyFn()]
    );
    const dispatch = useDispatch();
    const venues = useSelector(state => state.event.venues || []);
    const loadingVenues = useSelector(state => state.event.loadingVenues);

    useEffect(() => {
        if (!venues.length) dispatch(fetchVenues());
    }, [dispatch, venues.length]);

    // sincroniza al padre
    const propagate = (list) => {
        onChange(
            list.map(f => ({
                ...deepCloneFn(f),
                venue: { ...f.venue, capacity: Number(f.venue.capacity || 0) }
            }))
        );
    };

    useEffect(() => {
        setLocalFunctions(value.length ? value.map(deepCloneFn) : [createEmptyFn()]);
    }, [value]);

    const updateFn = (idx, field, val) => {
        setLocalFunctions(prev => {
            const next = prev.map(deepCloneFn);
            if (field.startsWith("venue.")) {
                const vf = field.replace("venue.", "");
                if (vf === "country" || vf === "city") next[idx].venue.location[vf] = val;
                else next[idx].venue[vf] = val;
            } else {
                next[idx][field] = val;
            }
            propagate(next);
            return next;
        });
    };

    const addFn = () => {
        setLocalFunctions(prev => {
            const next = [...prev, createEmptyFn()];
            propagate(next);
            return next;
        });
    };

    const removeFn = (idx) => {
        setLocalFunctions(prev => {
            const next = prev.filter((_, i) => i !== idx);
            propagate(next);
            return next;
        });
    };

    return (
        <div className="space-y-6">
            {localFunctions.map((fn, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-4 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 text-sm">Función {i + 1}</h3>
                        <button
                            type="button"
                            onClick={() => removeFn(i)}
                            className="text-xs text-red-600 hover:underline disabled:opacity-40"
                            disabled={localFunctions.length === 1}
                        >
                            Eliminar
                        </button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label htmlFor={`fn-name-${i}`} className="block mb-1 text-xs font-medium text-gray-700">Nombre</label>
                            <input
                                id={`fn-name-${i}`}
                                type="text"
                                className="w-full bg-white border border-gray-300 rounded p-2 text-sm"
                                value={fn.name}
                                onChange={e => updateFn(i, "name", e.target.value)}
                                required
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor={`fn-desc-${i}`} className="block mb-1 text-xs font-medium text-gray-700">Descripción</label>
                            <textarea
                                id={`fn-desc-${i}`}
                                rows={3}
                                className="w-full bg-white border border-gray-300 rounded p-2 text-sm"
                                value={fn.description}
                                onChange={e => updateFn(i, "description", e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor={`fn-start-${i}`} className="block mb-1 text-xs font-medium text-gray-700">Inicio</label>
                            <input
                                id={`fn-start-${i}`}
                                type="datetime-local"
                                className="w-full bg-white border border-gray-300 rounded p-2 text-sm"
                                value={fn.startDate}
                                onChange={e => updateFn(i, "startDate", e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor={`fn-end-${i}`} className="block mb-1 text-xs font-medium text-gray-700">Fin</label>
                            <input
                                id={`fn-end-${i}`}
                                type="datetime-local"
                                className="w-full bg-white border border-gray-300 rounded p-2 text-sm"
                                value={fn.endDate}
                                onChange={e => updateFn(i, "endDate", e.target.value)}
                                required
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor={`venue-select-${i}`} className="block mb-1 text-xs font-medium text-gray-700">Lugar</label>
                            <select
                                id={`venue-select-${i}`} // único por índice
                                className="w-full bg-white border border-gray-300 rounded p-2 text-sm"
                                value={fn.venue.name}
                                onChange={e => {
                                    const name = e.target.value;
                                    const selected = venues.find(v => v.name === name);
                                    if (selected) {
                                        updateFn(i, "venue.name", selected.name);
                                        updateFn(i, "venue.capacity", String(selected.capacity));
                                        updateFn(i, "venue.address", selected.address);
                                        updateFn(i, "venue.country", selected.location.country);
                                        updateFn(i, "venue.city", selected.location.city);
                                    } else {
                                        updateFn(i, "venue.name", name);
                                    }
                                }}
                                required
                            >
                                <option value="">Seleccione venue</option>
                                {loadingVenues && <option value="" disabled>Cargando...</option>}
                                {venues.map(v => (
                                    <option key={v.name} value={v.name}>
                                        {v.name} ({v.location.city}, {v.location.country})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={addFn}
                    className="px-4 py-2 bg-brandBlue text-white text-xs rounded-lg hover:opacity-80"
                >
                    Añadir función
                </button>
            </div>
        </div>
    );
}

export default FunctionsEditor;
