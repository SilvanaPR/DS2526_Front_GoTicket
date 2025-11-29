"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVenues } from "../../../lib/features/event/eventSlice"; // correcto desde app/components/Event

export default function FunctionsEditor({ value = [], onChange }) {
    const dispatch = useDispatch();
    const venues = useSelector((s) => s.events?.venues) || [];
    const loadingVenues = useSelector((s) => s.events?.loadingVenues) || false;

    useEffect(() => {
        if (!venues.length) dispatch(fetchVenues());
    }, [dispatch, venues.length]);

    const updateFunction = (index, patch) => {
        const next = value.map((f, i) => (i === index ? { ...f, ...patch } : f));
        onChange(next);
    };

    const addFunction = () =>
        onChange([...value, { name: "", description: "", startDate: "", endDate: "", venueId: "" }]);

    const removeFunction = (index) => {
        if (value.length <= 1) return;
        onChange(value.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            {value.map((f, i) => (
                <div key={i} className="border rounded-lg p-4 bg-gray-50 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 text-sm">Función {i + 1}</h3>
                        <button
                            type="button"
                            onClick={() => removeFunction(i)}
                            className="text-xs text-red-600 hover:underline disabled:opacity-40"
                            disabled={value.length === 1}
                        >
                            Eliminar
                        </button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block mb-1 text-xs font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                className="w-full bg-white border border-gray-300 rounded p-2 text-sm"
                                value={f.name}
                                onChange={(e) => updateFunction(i, { name: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-xs font-medium text-gray-700">Lugar (Venue)</label>
                            <select
                                className="w-full bg-white border border-gray-300 rounded p-2 text-sm"
                                value={f.venueId || ""}
                                onChange={(e) => updateFunction(i, { venueId: e.target.value })}
                                required
                                disabled={loadingVenues}
                            >
                                <option value="">{loadingVenues ? "Cargando..." : "Seleccione un venue"}</option>
                                {venues.map((v) => (
                                    <option key={v.id || v.venueId} value={v.id || v.venueId}>
                                        {v.name} {v.capacity ? `(Cap: ${v.capacity})` : ""}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 text-xs font-medium text-gray-700">Inicio</label>
                            <input
                                type="datetime-local"
                                className="w-full bg-white border border-gray-300 rounded p-2 text-sm"
                                value={f.startDate}
                                onChange={(e) => updateFunction(i, { startDate: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-xs font-medium text-gray-700">Fin</label>
                            <input
                                type="datetime-local"
                                className="w-full bg-white border border-gray-300 rounded p-2 text-sm"
                                value={f.endDate}
                                onChange={(e) => updateFunction(i, { endDate: e.target.value })}
                                required
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block mb-1 text-xs font-medium text-gray-700">Descripción</label>
                            <textarea
                                rows={3}
                                className="w-full bg-white border border-gray-300 rounded p-2 text-sm"
                                value={f.description}
                                onChange={(e) => updateFunction(i, { description: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={addFunction}
                    className="px-4 py-2 bg-brandBlue text-white text-xs rounded-lg hover:opacity-80"
                >
                    Añadir función
                </button>
            </div>
        </div>
    );
}
