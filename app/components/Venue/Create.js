"use client";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries, fetchCities, createVenue, updateVenue } from "../../../lib/features/event/eventSlice";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";


const emptyVenue = {
    id: "",
    name: "",
    capacity: "",
    address: "",
    location: { country: "", city: "" }
};

export default function VenueForm({ initialVenue, onSubmit }) {
    const dispatch = useDispatch();
    const countries = useSelector((s) => s.events?.countries) || [];
    const loadingCountries = useSelector((s) => s.events?.loadingCountries) || false;
    const cities = useSelector((s) => s.events?.cities) || [];
    const loadingCities = useSelector((s) => s.events?.loadingCities) || false;
    const sliceError = useSelector((s) => s.events?.error) || "";      // lee error del slice
    const loadingVenues = useSelector((s) => s.events?.loadingVenues) || false; // estado de carga

    const [form, setForm] = useState(emptyVenue);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const initialCityRef = useRef("");

    // Cargar países al montar
    useEffect(() => {
        if (!countries.length) dispatch(fetchCountries());
    }, [dispatch, countries.length]);

    // Cuando cambia el país, limpia ciudad y carga ciudades
    useEffect(() => {
        const code = form.location.country;
        if (!code) return;
        setForm(prev => ({ ...prev, location: { ...prev.location, city: "" } }));
        dispatch(fetchCities({ countryCode: code }));
    }, [dispatch, form.location.country]);

    useEffect(() => {
        if (initialVenue && (initialVenue.id || initialVenue.name)) {
            const countryFromNameOrCode = countries.find(
                c => c.name === initialVenue.location?.country || c.code === initialVenue.location?.country
            );
            const countryCode = countryFromNameOrCode?.code || initialVenue.location?.country || "";

            initialCityRef.current = initialVenue.location?.city ?? "";
            setForm({
                id: initialVenue.id ?? "",
                name: initialVenue.name ?? "",
                capacity: String(initialVenue.capacity ?? ""),
                address: initialVenue.address ?? "", // Agregado
                location: { country: countryCode, city: "" } // ciudad se setea luego
            });
        } else {
            initialCityRef.current = "";
            setForm(emptyVenue);
        }
    }, [initialVenue, countries]);

    // Al cargar ciudades, aplica la ciudad inicial si existe
    useEffect(() => {
        const pendingCity = initialCityRef.current;
        if (!pendingCity || !cities.length) return;
        setForm(prev => ({ ...prev, location: { ...prev.location, city: pendingCity } }));
        initialCityRef.current = "";
    }, [cities]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("location.")) {
            const key = name.replace("location.", "");
            setForm(prev => {
                const next = { ...prev, location: { ...prev.location, [key]: value } };
                if (key === "country") next.location.city = "";
                return next;
            });
        } else {
            setForm(prev => ({
                ...prev,
                [name]: name === "capacity" ? value.replace(/[^0-9]/g, "") : value
            }));
        }
    };

    // Reemplaza handleSubmit para crear/actualizar según haya id
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payloadBase = {
            name: form.name.trim(),
            capacity: Number(form.capacity) || 0,
            address: form.address.trim(),
            locationId: form.location.country,
        };

        let action;
        if (form.id) {
            action = await dispatch(updateVenue({ id: form.id, ...payloadBase }));
        } else {
            action = await dispatch(createVenue(payloadBase));
        }

        if (updateVenue.fulfilled.match(action) || createVenue.fulfilled.match(action)) {
            setForm(emptyVenue);
            toast.success(form.id ? "Venue actualizado correctamente" : "Venue creado correctamente", {
                position: "bottom-right",
                className: "text-medium py-6 px-8 rounded-md shadow-lg bg-green-100 text-green-700"
            });
        }
        setIsSubmitting(false);
    };

    return (
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
            {/* elimina el banner local de éxito */}
            <div className="relative mb-4">
                <Link
                    href="/Event/Venue"
                    className="absolute left-0 top-1/2 -translate-y-1/2 inline-flex"
                    aria-label="Volver a Venues"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                    </svg>
                </Link>
                <h2 className="text-xl font-bold text-gray-900 text-center">
                    {form.id ? "Modificar Venue" : "Crear Venue"}
                </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">Nombre</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="capacity" className="block mb-1 text-sm font-medium text-gray-700">Capacidad</label>
                    <input
                        id="capacity"
                        name="capacity"
                        type="text"
                        inputMode="numeric"
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm"
                        placeholder="0"
                        value={form.capacity}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="address" className="block mb-1 text-sm font-medium text-gray-700">Dirección</label>
                    <input
                        id="address"
                        name="address"
                        type="text"
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm"
                        value={form.address}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="location.country" className="block mb-1 text-sm font-medium text-gray-700">País</label>
                        <select
                            id="location.country"
                            name="location.country"
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm"
                            value={form.location.country}
                            onChange={handleChange}
                            required
                        >
                            <option value="">{loadingCountries ? "Cargando..." : "Seleccione país"}</option>
                            {countries.map(c => (
                                <option key={c.code} value={c.code}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="location.city" className="block mb-1 text-sm font-medium text-gray-700">Ciudad</label>
                        <select
                            id="location.city"
                            name="location.city"
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm"
                            value={form.location.city}
                            onChange={handleChange}
                            required
                            disabled={!form.location.country}
                        >
                            <option value="">{loadingCities ? "Cargando..." : "Seleccione ciudad"}</option>
                            {cities.map(ct => (
                                <option key={ct} value={ct}>{ct}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Muestra el error del slice (si hay) */}
                {sliceError && (
                    <p className="text-xs text-red-600">{sliceError}</p>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className={`inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-brand rounded-lg focus:ring-4 focus:ring-primary-200 ${isSubmitting || loadingVenues ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting || loadingVenues}
                    >
                        {isSubmitting || loadingVenues ? "Guardando..." : form.id ? "Guardar cambios" : "Crear Venue"}
                    </button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}