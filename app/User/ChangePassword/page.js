"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";
import { forgotPassword } from "../../../lib/features/user/userSlice";
import { useRouter } from "next/navigation"; // <-- add

export default function ChangePassword() {
    const dispatch = useDispatch();
    const router = useRouter(); // <-- add
    const resetting = useSelector(s => s.user.resetting) || false;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({ email: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.email) {
            toast.error("Ingrese su correo electrónico");
            return;
        }
        // validación simple de correo
        const ok = /\S+@\S+\.\S+/.test(formData.email);
        if (!ok) {
            toast.error("Correo inválido");
            return;
        }
        setShowModal(true);
    };

    const handleConfirmSubmit = async () => {
        setShowModal(false);
        try {
            setIsSubmitting(true);
            const res = await dispatch(forgotPassword(formData.email));
            if (res.error) throw new Error(res.error.message || "Error al solicitar recuperación");

            toast.success("Se envió el enlace de recuperación a su correo", {
                position: "bottom-right",
            });
            setFormData({ email: "" });
        } catch (err) {
            toast.error("No fue posible enviar el enlace. Intente nuevamente.", {
                position: "bottom-right",
            });
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="items-center justify-center h-screen w-full">
            <form onSubmit={handleSubmit}>
                <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16 bg-white rounded-lg shadow grid gap-4 sm:grid-cols-2 sm:gap-6">
                    {/* Header con botón volver y título centrado */}
                    <div className="sm:col-span-2 relative flex justify-center items-center mb-2">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="absolute left-0 top-1/2 -translate-y-1/2 inline-flex text-gray-700 hover:text-gray-900"
                            aria-label="Volver"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                            </svg>
                        </button>
                        <h2 className="text-xl font-bold text-gray-900 text-center">
                            Recuperar contraseña
                        </h2>
                    </div>

                    {/* EMAIL */}
                    <div className="sm:col-span-2 group ">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Correo electrónico</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="sm:col-span-2 group mb-4 flex justify-center">
                        <button
                            type="submit"
                            className={`inline-flex items-center px-6 py-3 mt-4 sm:mt-6 text-base font-medium text-white bg-brand rounded-lg focus:ring-4 focus:ring-primary-200 transition duration-200 ${isSubmitting || resetting ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={isSubmitting || resetting}
                        >
                            Enviar enlace de recuperación
                        </button>
                    </div>
                </div>

                {showModal && (
                    <ConfirmationModal
                        onCancel={() => setShowModal(false)}
                        onConfirm={handleConfirmSubmit}
                        message={"¿Enviar enlace de recuperación al correo ingresado?"}
                        loading={isSubmitting || resetting}
                    />
                )}
            </form>
            <ToastContainer />
        </div>
    );
}
