"use client";
import React, { useState, useEffect } from "react";
import ImageReader from "../ImageReader";
import { useDispatch, useSelector } from "react-redux";
import { createEventFull } from "../../../lib/features/event/eventSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ConfirmationModal from "../ConfirmationModal";
import { ToastContainer, toast } from "react-toastify";
import FunctionsEditor from "./FunctionsEditor";
import ZoneEditor from "./ZoneEditor";

function EventView(props) {
    const dispatch = useDispatch();
    const router = useRouter();

    const loadingEvent = useSelector((state) => state.events?.loadingEvent) || false;
    const eventFunctions = useSelector((state) => state.events?.selectedEventFunctions) || [];

    const [formData, setFormData] = useState({
        id: "",
        name: "",
        description: "",
        state: "Creado",
        image: "",
        zones: [],
        functions: [],
    });

    // ADD: estados faltantes
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [dragActive, setDragActive] = useState(false);

    function toDatetimeLocal(val) {
        if (!val) return "";
        const d = new Date(val);
        if (isNaN(d.getTime())) return "";
        const pad = (n) => String(n).padStart(2, "0");
        const yyyy = d.getFullYear();
        const mm = pad(d.getMonth() + 1);
        const dd = pad(d.getDate());
        const hh = pad(d.getHours());
        const mi = pad(d.getMinutes());
        return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    }

    function toISO(val) {
        if (!val) return null;
        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d.toISOString();
    }

    function normalizeFunctions(funcs = []) {
        return (Array.isArray(funcs) ? funcs : []).map(f => ({
            name: f.name ?? "",
            description: f.description ?? "",
            startDate: toDatetimeLocal(f.startDate ?? ""),
            endDate: toDatetimeLocal(f.endDate ?? ""),
            venueId: f.venueId ?? f.venue?.id ?? ""
        }));
    }

    function normalizeZones(zones = []) {
        return (Array.isArray(zones) ? zones : []).map(z => ({
            name: z.name ?? "",
            price: String(z.price ?? z.amount ?? 0)
        }));
    }

    // Hidratar desde props.event
    useEffect(() => {
        const ev = props.event;
        if (!ev) return;

        setFormData(prev => ({
            id: ev.id ?? "",
            name: ev.name ?? "",
            description: ev.description ?? "",
            state: ev.state ?? "Creado",
            image: ev.image ?? "",
            zones: normalizeZones(ev.zones),
            functions: Array.isArray(ev.functions) && ev.functions.length
                ? normalizeFunctions(ev.functions)
                : prev.functions
        }));
    }, [props.event]);

    // Si las funciones llegan por separado del slicer
    useEffect(() => {
        if (eventFunctions.length) {
            setFormData(prev => ({ ...prev, functions: normalizeFunctions(eventFunctions) }));
        }
    }, [eventFunctions]);

    // cuando llega el evento, mostrar su imagen
    useEffect(() => {
        const ev = props.event;
        if (ev?.image) {
            setImagePreview(ev.image);
        }
    }, [props.event]);

    // HANDLE CHANGE PARA INPUTS DEL FORM
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
        setImagePreview(file ? URL.createObjectURL(file) : "");
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0] || null;
        if (file && file.type.startsWith("image/")) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // sube la imagen si hay archivo seleccionado y devuelve la URL
    const uploadImageIfNeeded = async () => {
        if (!imageFile) return formData.image || ""; // mantener la URL existente si no se cambia
        const fd = new FormData();
        fd.append("file", imageFile);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error("Error subiendo imagen");
        const data = await res.json();
        return data.url; // URL pública
    };

    const executeSubmit = async (e) => {
        e?.preventDefault?.();
        setIsSubmitting(true);

        try {
            console.log("EventView - formData antes de enviar:", JSON.stringify(formData, null, 2));

            // Validación mínima
            const functions = (formData.functions || [])
                .filter(f => (f.name ?? "").trim() && f.venueId && f.startDate && f.endDate);

            if (functions.length === 0) {
                setIsSubmitting(false);
                toast.error("Debe agregar al menos una función asociada.", { position: "bottom-right" });
                return;
            }

            // Genera un eventId para asociar en funciones y zonas (si no viene uno)
            const eventId = formData.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : "00000000-0000-0000-0000-000000000000");

            // Construye exactamente el JSON requerido
            const payload = {
                event: {
                    name: String(formData.name ?? ""),
                    description: String(formData.description ?? ""),
                    status: String(formData.state ?? "Creado"),
                },
                functions: functions.map(f => ({
                    name: String(f.name ?? ""),
                    description: String(f.description ?? ""),
                    startDate: new Date(f.startDate).toISOString(),
                    endDate: new Date(f.endDate).toISOString(),
                    eventId: eventId,
                    venueId: String(f.venueId),
                })),
                zones: (formData.zones || [])
                    .filter(z => (z.name ?? "").trim() !== "")
                    .map(z => ({
                        name: String(z.name ?? ""),
                        price: Number(z.price ?? 0),
                        eventId: eventId,
                    })),
            };

            // Log JSON exacto antes de enviar
            console.log("EventView - payload EXACTO:", JSON.stringify(payload, null, 2));

            const res = await dispatch(createEventFull({ payload }));
            if (res.error) throw new Error(res.error.message || "Error al crear evento");

            toast.success("Evento creado exitosamente", {
                position: "bottom-right",
                className: "text-medium py-6 px-8 rounded-md shadow-lg bg-green-100 text-green-700"
            });

            setTimeout(() => router.push("/Event"), 1200);
        } catch (err) {
            console.error("Error al guardar el evento:", err);
            toast.error("Error al guardar el evento", {
                position: "bottom-right",
                className: "text-medium py-4 px-6 rounded-md shadow-lg bg-red-100 text-red-700"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmSubmit = async () => {
        setShowModal(false);
        await executeSubmit();
    };

    const applyFunctions = (functionsList) => {
        setFormData(prev => ({ ...prev, functions: functionsList }));
    };

    const applyZones = (zonesList) => {
        setFormData(prev => ({ ...prev, zones: zonesList }));
    };

    useEffect(() => {
        return () => {
            if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    if (loadingEvent) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-brand border-e-transparent" role="status">
                    <span className="sr-only">Cargando evento...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="items-center justify-center h-screen w-full">
            <section>
                <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16 bg-white rounded-lg shadow">
                    {/* Back icon left, title centered */}
                    <div className="relative mb-6">
                        <Link href={`/Event`} className="absolute left-0 top-1/2 -translate-y-1/2 inline-flex">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                            </svg>
                        </Link>
                        <h2 className="text-xl font-bold text-gray-900 text-center">
                            {formData.id ? "Modificar Evento" : "Registrar Evento Nuevo"}
                        </h2>
                    </div>
                    <div className="h-px w-full bg-gray-200 mb-8" />

                    <form onSubmit={(e) => { e.preventDefault(); setShowModal(true); }}>
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 mt-2">

                            {/* IMAGEN (más bonito con drag & drop) */}
                            <div className="sm:col-span-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900">Imagen del evento</label>

                                <div
                                    onDragEnter={handleDrag}
                                    onDragOver={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDrop={handleDrop}
                                    className={`relative flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl p-6 transition ${dragActive ? "border-brand bg-brand/5" : "border-gray-300 bg-gray-50"
                                        }`}
                                >
                                    <input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                    <div className="flex flex-col items-center gap-3 text-center">
                                        <div className="h-48 w-48 rounded-lg overflow-hidden border bg-white shadow-sm">
                                            {imagePreview || formData.image ? (
                                                <img
                                                    src={imagePreview || formData.image}
                                                    alt="Vista previa"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                // SVG de preview por defecto
                                                <div className="flex items-center justify-center h-full w-full bg-gray-100">
                                                    <svg
                                                        className="w-16 h-16 text-gray-500"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="64"
                                                        height="64"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path fillRule="evenodd" d="M13 10a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H14a1 1 0 0 1-1-1Z" clipRule="evenodd" />
                                                        <path fillRule="evenodd" d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12c0 .556-.227 1.06-.593 1.422A.999.999 0 0 1 20.5 20H4a2.002 2.002 0 0 1-2-2V6h16v9.95l-3.257-3.619a1 1 0 0 0-1.557.088L11.2 18H8.892Z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-700">
                                                Arrastra y suelta una imagen aquí, o
                                                <label htmlFor="image" className="text-brand font-medium hover:underline cursor-pointer"> selecciónala</label>
                                            </p>
                                            <p className="text-xs text-gray-500">PNG, JPG o JPEG. Máx. 5MB.</p>
                                        </div>

                                        {(imageFile || formData.image) && (
                                            <div className="text-xs text-gray-600">
                                                {imageFile
                                                    ? <>Archivo: <span className="font-medium">{imageFile.name}</span> · {(imageFile.size / 1024 / 1024).toFixed(2)} MB</>
                                                    : <>Actual: <span className="font-medium">{formData.image}</span></>
                                                }
                                            </div>
                                        )}

                                        <div className="flex gap-3 mt-2">
                                            <label
                                                htmlFor="image"
                                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-brand rounded-lg hover:opacity-90 cursor-pointer"
                                            >
                                                Cambiar imagen
                                            </label>
                                            {imagePreview && (
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                                    onClick={() => {
                                                        if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
                                                        setImageFile(null);
                                                        setImagePreview("");
                                                    }}
                                                >
                                                    Quitar
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {dragActive && (
                                        <div className="absolute inset-0 rounded-xl ring-2 ring-brand/30 pointer-events-none" />
                                    )}
                                </div>
                            </div>

                            {/* NAME */}
                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Nombre</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            {/* DESCRIPTION */}
                            <div className="sm:col-span-2">
                                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">Descripción</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="6"
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                                    required
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <div className="h-px w-full bg-gray-200 my-2 sm:col-span-2" />

                            {/* FUNCTIONS TITLE */}
                            <div className="sm:col-span-2">
                                <h2 className="text-xl font-bold text-gray-900">Funciones</h2>
                            </div>

                            {/* INSERT: FunctionView */}
                            <div className="sm:col-span-2">
                                <FunctionsEditor
                                    value={formData.functions}
                                    onChange={applyFunctions}
                                />
                            </div>

                            <div className="h-px w-full bg-gray-200 my-4 sm:col-span-2" />
                            <div className="sm:col-span-2">
                                <h2 className="text-xl font-bold text-gray-900">Zonas</h2>
                            </div>
                            <div className="sm:col-span-2">
                                <ZoneEditor
                                    value={formData.zones}
                                    onChange={applyZones}
                                />
                            </div>


                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                className={`hover:opacity-80 inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-brand rounded-lg focus:ring-4 focus:ring-primary-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Guardando..." : formData.id ? "Modificar Evento" : "Crear Evento"}
                            </button>
                        </div>


                        {showModal && (
                            <ConfirmationModal
                                onCancel={() => setShowModal(false)}
                                onConfirm={handleConfirmSubmit}
                                message={"¿Deseas confirmar la operación?"}
                            />
                        )}
                    </form>
                </div>
            </section>
            <ToastContainer />
        </div>
    );
}

export default EventView;