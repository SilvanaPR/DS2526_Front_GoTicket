"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import VenueForm from "../../../components/Venue/Create";
import { fetchVenues /*, updateVenue */ } from "../../../../lib/features/event/eventSlice";

export default function EditVenuePage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const venues = useSelector(s => s.event.venues) || [];
    const loadingVenues = useSelector(s => s.event.loadingVenues) || false;

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!venues.length) dispatch(fetchVenues());
    }, [dispatch, venues.length]);

    const initialVenue = useMemo(() => {
        if (!id) return null;
        return venues.find(v => String(v.id) === String(id)) || null;
    }, [venues, id]);

    const handleSubmit = async (venue) => {
        try {
            setIsSubmitting(true);
            // const res = await dispatch(updateVenue({ id, venue }));
            // if (res.error) throw new Error(res.error.message || "Error al actualizar venue");
            console.log("Actualizar venue (mock):", { id, venue });
            router.push("/Event/Venue");
        } catch (err) {
            console.error("Error al actualizar venue:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadingVenues) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-brand border-e-transparent" role="status">
                    <span className="sr-only">Cargando venue...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-6">
            <VenueForm initialVenue={initialVenue} onSubmit={handleSubmit} />
        </div>
    );
}