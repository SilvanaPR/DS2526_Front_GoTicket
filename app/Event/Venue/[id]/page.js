"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import VenueForm from "../../../components/Venue/Create";
import { fetchVenues, updateVenue } from "../../../../lib/features/event/eventSlice";
import { ToastContainer, toast } from "react-toastify";

export default function VenueDetailPage({ params }) {
    const { id } = params;
    const dispatch = useDispatch();
    const venues = useSelector(s => s.events?.venues) || [];
    const loading = useSelector(s => s.events?.loadingVenues) || false;

    useEffect(() => {
        if (!venues.length) dispatch(fetchVenues());
    }, [venues.length, dispatch]);

    const v = venues.find(x => String(x.id) === String(id));

    const handleUpdate = async (form) => {
        const payload = {
            id: String(id),
            name: String(form.name || ""),
            capacity: Number(form.capacity || 0),
            address: String(form.address || ""),
            locationId: String(form.location?.country || ""),
        };
        const action = await dispatch(updateVenue(payload));
        if (updateVenue.fulfilled.match(action)) {
            toast.success("Venue actualizado correctamente", {
                position: "bottom-right",
                className: "text-medium py-6 px-8 rounded-md shadow-lg bg-green-100 text-green-700",
            });
        }
    };

    return (
        <div className="items-center justify-center h-screen w-full">
            <section className="py-8 px-4 mx-auto max-w-3xl lg:py-16 bg-white rounded-lg shadow">
                <div className="relative mb-6 flex items-center">
                    <Link href="/Event/Venue" className="absolute left-0 top-1/2 -translate-y-1/2 inline-flex">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6" fill="none">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                        </svg>
                    </Link>
                    <h2 className="w-full text-xl font-bold text-gray-900 text-center">Editar Venue</h2>
                </div>
                <div className="h-px w-full bg-gray-200 mb-6" />

                {loading && <div className="text-sm text-gray-600">Cargando venue...</div>}
                {!loading && !v && <div className="text-sm text-gray-600">Venue no encontrado.</div>}
                {v && (
                    <VenueForm
                        initialVenue={v}
                        onSubmit={handleUpdate}
                    />
                )}
                <ToastContainer />
            </section>
        </div>
    );
}