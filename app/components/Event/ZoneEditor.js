"use client";
import React, { useEffect, useState } from "react";

const createEmptyZone = () => ({
    name: "",
    price: "",
    capacity: ""
});

const cloneZone = (z) => ({
    name: z.name ?? "",
    price: z.price ?? "",
    capacity: z.capacity ?? ""
});

export default function ZoneEditor({ value = [], onChange }) {
    const [zones, setZones] = useState(value.length ? value.map(cloneZone) : [createEmptyZone()]);

    // NO agregamos id en objetos; usamos índice para ids de inputs
    useEffect(() => {
        setZones(value.length ? value.map(cloneZone) : [createEmptyZone()]);
    }, [value]);

    const propagate = (list) => {
        const normalized = list.map(z => ({
            name: (z.name ?? "").trim(),
            price: Number(String(z.price ?? "").replace(",", ".")) || 0,
            capacity: Number(String(z.capacity ?? "").replace(",", ".")) || 0
        }));
        onChange(normalized);
    };

    const updateZone = (idx, field, val) => {
        setZones(prev => {
            const next = prev.map(cloneZone);
            if (field === "price" || field === "capacity") {
                next[idx][field] = val.replace(/[^0-9.,]/g, "");
            } else {
                next[idx][field] = val;
            }
            propagate(next);
            return next;
        });
    };

    const addZone = () => {
        setZones(prev => {
            const next = [...prev, createEmptyZone()];
            propagate(next);
            return next;
        });
    };

    const removeZone = (idx) => {
        setZones(prev => {
            const next = prev.filter((_, i) => i !== idx);
            propagate(next);
            return next;
        });
    };

    return (
        <div className="space-y-6">
            {zones.map((z, i) => (
                <div key={i} className="border rounded-lg p-4 bg-gray-50 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 text-sm">Zona {i + 1}</h3>
                        <button
                            type="button"
                            onClick={() => removeZone(i)}
                            className="text-xs text-red-600 hover:underline disabled:opacity-40"
                            disabled={zones.length === 1}
                        >
                            Eliminar
                        </button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor={`zone-name-${i}`} className="block mb-1 text-xs font-medium text-gray-700">Nombre</label>
                            <input
                                id={`zone-name-${i}`}
                                type="text"
                                className="w-full bg-white border border-gray-300 rounded p-2 text-sm"
                                value={z.name}
                                onChange={e => updateZone(i, "name", e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor={`zone-price-${i}`} className="block mb-1 text-xs font-medium text-gray-700">Precio</label>
                            <input
                                id={`zone-price-${i}`}
                                type="text"
                                inputMode="decimal"
                                className="w-full bg-white border border-gray-300 rounded p-2 text-sm"
                                value={z.price}
                                onChange={e => updateZone(i, "price", e.target.value)}
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor={`zone-capacity-${i}`} className="block mb-1 text-xs font-medium text-gray-700">Capacidad</label>
                            <input
                                id={`zone-capacity-${i}`}
                                type="text"
                                inputMode="numeric"
                                className="w-full bg-white border border-gray-300 rounded p-2 text-sm"
                                value={z.capacity}
                                onChange={e => updateZone(i, "capacity", e.target.value)}
                                placeholder="0"
                                required
                            />
                        </div>
                    </div>
                </div>
            ))}

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={addZone}
                    className="px-4 py-2 bg-brandBlue text-white text-xs rounded-lg hover:opacity-80"
                >
                    Añadir zona
                </button>
            </div>
        </div>
    );
}