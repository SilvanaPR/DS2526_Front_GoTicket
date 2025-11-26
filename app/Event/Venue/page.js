"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VenueForm from "../../components/Venue/Create";
import VenueCard from "../../components/Venue/VenueCard";
import { fetchVenues } from "../../../lib/features/event/eventSlice";
import Link from "next/link";

export default function VenueList() {
    const dispatch = useDispatch();
    const venues = useSelector(s => s.event.venues) || [];
    const loadingVenues = useSelector(s => s.event.loadingVenues) || false;

    const [editingVenue, setEditingVenue] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (!venues.length) dispatch(fetchVenues());
    }, [dispatch, venues.length]);

    const handleSubmit = async (venue) => {
        console.log("Enviar venue:", venue);
        setEditingVenue(null);
        setShowForm(false);
        dispatch(fetchVenues());
    };

    return (
        <div className="min-h-screen w-full flex flex-col gap-8 bg-gray-100 p-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Venues</h2>
                <Link
                    href="/Event/Venue/Create"
                    className="px-4 py-2 text-xs font-medium rounded bg-brand text-white hover:opacity-90 inline-flex items-center"
                >
                    Nuevo Venue
                </Link>
            </div>

            {showForm && (
                <div className="max-w-lg">
                    <VenueForm
                        initialVenue={editingVenue}
                        onSubmit={handleSubmit}
                    />
                </div>
            )}

            {loadingVenues && (
                <div className="text-sm text-gray-600">Cargando venues...</div>
            )}

            {!loadingVenues && venues.length === 0 && (
                <div className="text-sm text-gray-600">No hay venues disponibles.</div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {venues.map(v => (
                    <Link
                        key={String(v.id ?? v.name)}
                        href={`/Event/Venue/${encodeURIComponent(v.id ?? v.name)}`}
                        className="block"
                    >
                        <VenueCard
                            venue={v}
                            onEdit={() => { }}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}