"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import VenueCard from "../../components/Venue/VenueCard";
import { fetchVenues } from "../../../lib/features/event/eventSlice";

export default function VenueListPage() {
    const dispatch = useDispatch();
    const venues = useSelector((s) => s.events?.venues) || [];
    const loading = useSelector((s) => s.events?.loadingVenues) || false;

    useEffect(() => {
        if (!venues.length) dispatch(fetchVenues());
    }, [venues.length, dispatch]);

    return (
        <div className="min-h-screen w-full bg-gray-100">
            <section className="py-8 px-4 mx-auto max-w-5xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Venues</h2>
                    <Link
                        href="/Event/Venue/Create"
                        className="px-4 py-2 rounded bg-brand text-white text-sm hover:opacity-90"
                    >
                        Crear Venue
                    </Link>
                </div>

                {loading && <div className="text-sm text-gray-600">Cargando venues...</div>}
                {!loading && venues.length === 0 && (
                    <div className="text-sm text-gray-600">No hay venues registrados.</div>
                )}

                <ul className="space-y-4">
                    {venues.map((v) => (
                        <li key={v.id || v.venueId}>
                            <Link href={`/Event/Venue/${v.id || v.venueId}`} className="block">
                                <VenueCard
                                    venue={{
                                        name: v.name,
                                        location: v.location,
                                        address: v.address,
                                        capacity: v.capacity,
                                    }}
                                    onEdit={() => { }}
                                />
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}