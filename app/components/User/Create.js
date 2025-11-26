"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import ConfirmationModal from '../ConfirmationModal';


export default function Configuration(user) {
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        adress: '',
        email: '',
        password: '',
        confirmed_password: '',
        phone_number: '',
        user_type: ''
    });

    const userTypes = [
        { value: 'ADMIN', label: 'Admin' },
        { value: 'CLIENT', label: 'Cliente' },
        { value: 'ORGANIZER', label: 'Organizador' },
    ];

    useEffect(() => {
        if (user && user.user) {
            setFormData(prev => ({
                ...prev,
                first_name: user.user.userName || '',
                last_name: user.user.userLastName || '',
                adress: user.user.userAddress || '',
                email: user.user.userEmail || '',
                phone_number: user.user.userPhone || '',
                user_type: user.user.usersType || '',
                password: '',
                confirmed_password: ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    function buildUserPayload(data) {
        return {
            userEmail: data.email,
            userName: data.first_name,
            userLastName: data.last_name,
            userPhone: data.phone_number,
            userAddress: data.adress,
            usersType: data.user_type,
            password: data.password
        };
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isEditing) {
            setIsEditing(true);
            return;
        }
        if (formData.password !== formData.confirmed_password) {
            toast.error("Las contraseñas no coinciden");
            return;
        }
        setShowModal(true);
    };

    const handleConfirmSave = async () => {
        setShowModal(false);
        try {
            setIsSubmitting(true);
            const payload = buildUserPayload(formData);
            await dispatch(saveUser(payload));
            toast.success("Cambios guardados correctamente", {
                position: "bottom-right",
                className: "text-medium py-6 px-8 rounded-md shadow-lg bg-green-100 text-green-700",
            });
            setIsEditing(false);
        } catch {
            toast.error("Error al guardar los cambios");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="items-center justify-center h-screen w-full">
            <form onSubmit={handleSubmit}>
                <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16 bg-white rounded-lg shadow grid gap-4 sm:grid-cols-2 sm:gap-6">

                    {/* FIRST NAME */}
                    <div className="w-full mb-4">
                        <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900">Nombre</label>
                        <input
                            type="text"
                            name="first_name"
                            id="first_name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                    </div>

                    {/* LAST NAME */}
                    <div className="w-full mb-4">
                        <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900">Apellido</label>
                        <input
                            type="text"
                            name="last_name"
                            id="last_name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="w-full mb-4">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
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

                    {/* PHONE NUMBER */}
                    <div className="w-full mb-4">
                        <label htmlFor="phone_number" className="block mb-2 text-sm font-medium text-gray-900">Teléfono</label>
                        <input
                            type="text"
                            name="phone_number"
                            id="phone_number"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
                            value={formData.phone_number}
                            onChange={handleChange}
                        />
                    </div>

                    {/* ADRESS */}
                    <div className="sm:col-span-2 group mb-4">
                        <label htmlFor="adress" className="block mb-2 text-sm font-medium text-gray-900">Dirección</label>
                        <textarea
                            id="adress"
                            name="adress"
                            rows="4"
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                            required
                            value={formData.adress}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    {/* PASSWORD */}
                    <div className="w-full mb-4">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            value={formData.password}
                            onChange={handleChange}
                            required={isEditing}
                        />
                    </div>

                    {/* CONFIRMED PASSWORD */}
                    <div className="w-full mb-4">
                        <label htmlFor="confirmed_password" className="block mb-2 text-sm font-medium text-gray-900">Confirmar Contraseña</label>
                        <input
                            type="password"
                            name="confirmed_password"
                            id="confirmed_password"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            value={formData.confirmed_password}
                            onChange={handleChange}
                            required={isEditing}
                        />
                    </div>

                    {/* USER TYPE */}
                    <div className="sm:col-span-2 group mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Tipo de Usuario</label>
                        <div className="flex flex-wrap gap-6">
                            {userTypes.map(t => (
                                <label key={t.value} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="user_type"
                                        value={t.value}
                                        checked={formData.user_type === t.value}
                                        onChange={handleChange}
                                        className="w-4 h-4 border border-gray-300 text-brand focus:ring-2 focus:ring-brand-soft"
                                    />
                                    <span className="text-sm text-gray-900">{t.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="sm:col-span-2 group mb-4">
                        <button
                            type="submit"
                            className={`inline-flex items-center px-6 py-3 mt-4 sm:mt-6 text-base font-medium text-white bg-brand rounded-lg focus:ring-4 focus:ring-primary-200 transition duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSubmitting}
                        >
                            Crear Usuario
                        </button>
                    </div>
                </div>
            </form>
            {showModal && (
                <ConfirmationModal
                    onCancel={() => setShowModal(false)}
                    onConfirm={handleConfirmSave}
                    message={"¿Estás seguro de guardar los cambios?"}
                    loading={isSubmitting}
                />
            )}
            <ToastContainer />
        </div>
    );
}
