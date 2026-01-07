"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchEvent } from "../../../lib/features/event/eventSlice";

export default function EventDetail({ id, eventId }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const effectiveId = id || eventId;

    const loading = useSelector((s) => s?.events?.loadingEvent) || false;
    const event = useSelector((s) => s?.events?.selectedEvent) || null;


    const firstFunction = event?.functions?.[0];
    const minZonePrice = event?.zones?.length
        ? Math.min(...event.zones.map((z) => Number(z.price || 0)))
        : null;

    return (
        <section className="bg-gray-50 py-8 antialiased md:py-12">
            <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                <div className="mb-6 flex items-center gap-3">
                    <Link href="/Event" className="inline-flex">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                        </svg>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Detalle de Evento</h1>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-brand border-e-transparent" role="status">
                            <span className="sr-only">Cargando...</span>
                        </div>
                    </div>
                ) : event ? (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">
                        {/* IMAGE */}
                        <div className="lg:col-span-1 h-full">
                            <div className="h-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <span className="rounded bg-brand bg-opacity-20 px-2.5 py-0.5 text-xs font-medium text-brand">
                                        {event.state}
                                    </span>
                                </div>
                                <div className="h-64 w-full flex items-center justify-center bg-gray-50 rounded-md flex-shrink-0">
                                    <img
                                        className="object-contain mx-auto h-full"
                                        src={event.image || "/GoTicketIcon.jpg"}
                                        alt={event.name || "Evento"}
                                        onError={(e) => {
                                            e.currentTarget.src = "/GoTicketIcon.jpg";
                                        }}
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* DETAILS */}
                        <div className="lg:col-span-2 h-full">
                            <div className="h-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm flex flex-col">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        {event.discountStatus === "Activo" && event.discountCode && (
                                            <div className="mb-2 flex items-center gap-2">
                                                <span className="rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                                                    {event.discountCode} - {Number(event.discountPer || 0)}%
                                                </span>
                                            </div>
                                        )}
                                        <h2 className="text-2xl font-bold text-gray-900">{event.name}</h2>
                                        <p className="mt-2 text-sm text-gray-600">{event.description}</p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <button
                                            className="px-4 py-2 rounded-md bg-brand hover:opacity-90 text-white"
                                            onClick={() => router.push(`/Event/${event.id}`)}
                                        >
                                            Editar Evento
                                        </button>
                                    </div>
                                </div>

                                {/* Dates and Functions */}
                                <div className="mt-6">
                                    <div className="h-px w-full bg-gray-200 my-4 sm:col-span-2" />
                                    <div className="sm:col-span-2">
                                        <h2 className="text-xl font-bold text-gray-900">Funciones</h2>
                                    </div>
                                    <div className="mt-2 space-y-2">
                                        {(event.functions || []).length ? (
                                            event.functions.map((f, idx) => (
                                                <div key={idx} className="rounded-md p-3 border-2 border-brand text-base shadow-sm bg-brand hover:opacity-50 opacity-80">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-white text-lg">{f.name || `Función ${idx + 1}`}</span>
                                                        <span className="text-white">-</span>
                                                        <span className="text-white">
                                                            {f.startDate ? new Date(f.startDate).toLocaleString() : "-"}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-sm text-gray-500">Sin funciones</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-600">No se encontró el evento.</div>
                )}
            </div>
        </section >
    );
}
