"use client";
import React from "react";

export default function VenueCard({ venue, onEdit }) {
    if (!venue) return null;
    const { name, price, location, address, capacity } = venue;

    return (
        <div className="rounded-lg border bg-white shadow-sm p-4 flex flex-col gap-2 hover:shadow-md transition">
            <div className="flex justify-between items-start">
                <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
                {typeof price !== "undefined" && (
                    <span className="text-xs px-2 py-1 rounded bg-brand/10 text-brand font-medium">
                        ${price}
                    </span>
                )}
            </div>
            <div className="text-xs text-gray-600">
                <p><span className="font-medium">País:</span> {location?.country || "-"}</p>
                <p><span className="font-medium">Ciudad:</span> {location?.city || "-"}</p>
                {address && <p><span className="font-medium">Dirección:</span> {address}</p>}
                {capacity != null && <p><span className="font-medium">Capacidad:</span> {capacity}</p>}
            </div>

            <div className="mt-2 flex justify-end">
                <button
                    type="button"
                    onClick={() => onEdit && onEdit(venue)}
                    className="text-xs px-3 py-1 rounded bg-gray-800 text-white hover:bg-gray-700"
                >
                    Editar
                </button>
            </div>
        </div>
    );
}