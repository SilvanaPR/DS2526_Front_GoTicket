"use client";
import React from "react";
import VenueForm from "../../../components/Venue/Create";

export default function CreateVenue() {
    const handleSubmit = async (venue) => {
        // Aquí integras con tu API o Redux thunks si los tienes
        console.log("Enviar venue:", venue);
        // Ejemplo:
        // await dispatch(createVenue({ venue }));
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-6">
            <VenueForm initialVenue={null} onSubmit={handleSubmit} />
        </div>
    );
}