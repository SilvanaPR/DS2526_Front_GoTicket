"use client";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries, fetchCities } from "../../../lib/features/event/eventSlice";
import Link from "next/link";

const emptyVenue = {
    id: "",
    name: "",
    capacity: "",
    location: { country: "", city: "" }
};

export default function VenueForm({ initialVenue, onSubmit }) {
    const dispatch = useDispatch();
    const countries = useSelector((s) => s.event.countries) || [];
    const loadingCountries = useSelector((s) => s.event.loadingCountries) || false;
    const cities = useSelector((s) => s.event.cities) || [];
    const loadingCities = useSelector((s) => s.event.loadingCities) || false;

    const [form, setForm] = useState(emptyVenue);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const initialCityRef = useRef("");

    // Cargar países al montar
    useEffect(() => {
        if (!countries.length) dispatch(fetchCountries());
    }, [dispatch, countries.length]);

    // Hidratar país usando code; guardar ciudad para aplicarla luego
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
                location: { country: countryCode, city: "" } // ciudad se setea luego
            });
        } else {
            initialCityRef.current = "";
            setForm(emptyVenue);
        }
    }, [initialVenue, countries]);

    // Cuando cambia el país, cargar ciudades
    useEffect(() => {
        const code = form.location.country;
        if (code) dispatch(fetchCities({ countryCode: code }));
    }, [dispatch, form.location.country]);

    // Cuando ciudades se actualizan, aplicar ciudad del venue
    useEffect(() => {
        const pendingCity = initialCityRef.current;
        if (!pendingCity) return;
        if (!cities.length) return;

        // Si la ciudad no está en el slicer, agrégala temporalmente para poder seleccionarla
        const hasCity = cities.includes(pendingCity);
        if (!hasCity) {
            // agrega la ciudad al listado localmente (no al store) para poder mostrarla
            // Nota: si prefieres no mutar, simplemente selecciona la ciudad aunque no esté en las opciones.
            // Algunos navegadores muestran el valor aunque no esté en las opciones.
        }

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const payload = {
            id: form.id,
            name: form.name.trim(),
            capacity: Number(form.capacity) || 0,
            location: {
                country: form.location.country.trim(),
                city: form.location.city.trim()
            }
        };
        try {
            if (onSubmit) await onSubmit(payload);
            else console.log("Venue payload:", payload);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
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

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className={`inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-brand rounded-lg focus:ring-4 focus:ring-primary-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Guardando..." : form.id ? "Guardar cambios" : "Crear Venue"}
                    </button>
                </div>
            </form>
        </div>
    );
}