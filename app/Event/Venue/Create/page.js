"use client";
import React from "react";
import VenueForm from "../../../components/Venue/Create";

export default function CreateVenue() {
    return (
        <div className="min-h-screen w-full bg-gray-100">
            <section className="py-8 px-4 mx-auto max-w-3xl">
                <VenueForm />
            </section>
        </div>
    );
}