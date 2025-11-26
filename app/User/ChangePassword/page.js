"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function ChangePassword(user) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        password: '',
        newPassword: '',
        confirmpassword: '',
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowModal(true);
    };

    const sendForm = async () => {
        try {
            setIsSubmitting(true);
            const payload = { ...formData };
            console.log("Payload a enviar ⇢", payload);

            toast.success("Cambios guardados correctamente", {
                position: "bottom-right",
                className:
                    "text-medium py-6 px-8 rounded-md shadow-lg bg-green-100 text-green-700",
            });
        } catch (err) {
            toast.error("Error al guardar los cambios");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmSubmit = async () => {
        setShowModal(false);
        await sendForm();
    };

    return (
        <div className="items-center justify-center h-screen w-full">
            <form onSubmit={handleSubmit}>
                <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16 bg-white rounded-lg shadow grid gap-4 sm:grid-cols-2 sm:gap-6">
                    <h2 className="mb-4 text-xl font-bold text-gray-900">{'Cambiar Contraseña'}</h2>

                    {/* PASSWORD */}
                    <div className="sm:col-span-2 group mb-4">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Contraseña Actual</label>
                        <input
                            type="text"
                            name="password"
                            id="password"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    {/* NEW PASSWORD */}
                    <div className="sm:col-span-2 group mb-4">
                        <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-900">Contraseña Nueva</label>
                        <input
                            type="text"
                            name="newPassword"
                            id="newPassword"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
                            value={formData.newPassword}
                            onChange={handleChange}
                        />
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="sm:col-span-2 group mb-4">
                        <label htmlFor="confirmpassword" className="block mb-2 text-sm font-medium text-gray-900">Confirmar Contraseña Nueva</label>
                        <input
                            type="text"
                            name="confirmpassword"
                            id="confirmpassword"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
                            value={formData.confirmpassword}
                            onChange={handleChange}
                        />
                    </div>


                    <div className="sm:col-span-2 group mb-4">
                        <button
                            type="submit"
                            className={`inline-flex items-center px-6 py-3 mt-4 sm:mt-6 text-base font-medium text-white bg-brand rounded-lg focus:ring-4 focus:ring-primary-200 transition duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSubmitting}
                        >
                            {'Guardar Cambios'}
                        </button>
                    </div>
                </div >

                {showModal && (
                    <ConfirmationModal
                        onCancel={() => setShowModal(false)}
                        onConfirm={handleConfirmSubmit}
                        message={"¿Estás seguro de que deseas cambiar la contraseña?"}
                    />
                )}
            </form >
            <ToastContainer />
        </div >
    );
}
