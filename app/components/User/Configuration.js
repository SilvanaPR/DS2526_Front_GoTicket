"use client";
import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import ConfirmationModal from '../ConfirmationModal';
import { createUser, updateUser } from "../../../lib/features/user/userSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function Configuration({ mode = "create", initialUser = null }) {
    const normalizedMode = (mode || "").toLowerCase().trim();
    const isEdit = normalizedMode === "edit";
    const dispatch = useDispatch();
    const router = useRouter(); // <-- add
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(!isEdit);


    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        email: "",
        type: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: ""
    });

    const userTypes = [
        { value: 'Administrador', label: 'Admin' },
        { value: 'Soporte', label: 'Soporte' },
        { value: 'Usuario', label: 'Usuario' },
        { value: 'Organizador', label: 'Organizador' },

    ];


    useEffect(() => {
        if (isEdit && initialUser) {
            setFormData({
                name: initialUser.userName ?? "",
                lastName: initialUser.userLastName ?? "",
                email: initialUser.userEmail ?? "",
                type: initialUser.userType ?? "",
                phone: initialUser.userPhoneNumber ?? "",
                address: initialUser.userDirection ?? "",
                password: ""
            });
            setIsEditing(false);
        } else {
            setFormData({
                name: "",
                lastName: "",
                email: "",
                type: "",
                phone: "",
                address: "",
                password: "",
                confirmPassword: ""
            });
            setIsEditing(true);
        }
    }, [isEdit, initialUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    function buildUserPayload(fd) {
        return {
            userName: fd.name,
            userLastName: fd.lastName,
            userEmail: fd.email,
            userPhoneNumber: fd.phone,
            userDirection: fd.address,
            userType: fd.type,
            userPassword: fd.password,
        };
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === "edit" && !isEditing) {
            setIsEditing(true);
            return;
        }
        if (mode === "create") {
            if (!formData.password || !formData.confirmPassword) {
                toast.error("Debe ingresar y confirmar la contraseña");
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                toast.error("Las contraseñas no coinciden");
                return;
            }
        }
        setShowModal(true);
    };

    const handleConfirmSave = async () => {
        setShowModal(false);
        try {
            setIsSubmitting(true);
            const payload = buildUserPayload(formData);

            if (mode === "edit") {
                const userId = String(initialUser?.id ?? initialUser?.userId ?? "");
                if (!userId) throw new Error("userId no disponible para actualizar");
                const res = await dispatch(updateUser({ userId, user: payload }));
                if (res.error) throw new Error(res.error.message || "Error al actualizar usuario");
                toast.success("Usuario modificado correctamente", { position: "bottom-right" });
                setIsEditing(false);
            } else {
                const res = await dispatch(createUser(payload));
                if (res.error) throw new Error(res.error.message || "Error al crear usuario");
                toast.success("Usuario creado correctamente", { position: "bottom-right" });

                setFormData({
                    name: "",
                    lastName: "",
                    email: "",
                    type: "",
                    phone: "",
                    address: "",
                    password: "",
                    confirmPassword: ""
                });
            }
        } catch (err) {
            toast.error("Error al guardar los cambios", { position: "bottom-right" });
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="items-center justify-center h-screen w-full">
            <form onSubmit={handleSubmit}>
                <div className="py-4 px-4 mx-auto max-w-2xl lg:py-16 bg-white rounded-lg shadow grid gap-4 sm:grid-cols-2 sm:gap-6">
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
                            {isEdit ? "Configuración de Usuario" : "Registrate!"}
                        </h2>
                    </div>

                    {/* NAME */}
                    <div className="w-full mb-4">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Nombre</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            disabled={mode === "edit" && !isEditing}
                        />
                    </div>

                    {/* LAST NAME */}
                    <div className="w-full mb-4">
                        <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900">Apellido</label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            disabled={mode === "edit" && !isEditing}
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
                            disabled={mode === "edit" && !isEditing}
                        />
                    </div>

                    {/* PHONE */}
                    <div className="w-full mb-4">
                        <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">Teléfono</label>
                        <input
                            type="text"
                            name="phone"
                            id="phone"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={mode === "edit" && !isEditing}
                        />
                    </div>

                    {/* ADDRESS */}
                    <div className="sm:col-span-2 group mb-4">
                        <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">Dirección</label>
                        <textarea
                            id="address"
                            name="address"
                            rows="6"
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                            required
                            value={formData.address}
                            onChange={handleChange}
                            disabled={mode === "edit" && !isEditing}
                        ></textarea>
                    </div>

                    {/* USER TYPE */}
                    <div className="sm:col-span-2 group mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Tipo de Usuario</label>

                        {/* Si está en edición, bloquea el cambio de tipo */}
                        {mode === "edit" ? (
                            <div className="p-2.5 w-full text-sm text-gray-700 bg-gray-50 rounded-lg border border-gray-200">
                                <span className="font-medium"></span> {formData.type || "—"}
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-6">
                                {userTypes.map(t => (
                                    <label key={t.value} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="type"
                                            value={t.value}
                                            checked={formData.type === t.value}
                                            onChange={handleChange}
                                            className="w-4 h-4 border border-gray-300 text-brand focus:ring-2 focus:ring-brand-soft"
                                        />
                                        <span className="text-sm text-gray-900">{t.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* PASSWORD (solo creación) */}
                    {mode === "create" && (
                        <>
                            <div className="sm:col-span-2 group mb-4">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Contraseña</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="sm:col-span-2 group mb-4">
                                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900">Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                    <p className="mt-1 text-xs text-red-600">Las contraseñas no coinciden.</p>
                                )}
                            </div>
                        </>
                    )}

                    <div className="sm:col-span-2 group mb-4">
                        <button
                            type="submit"
                            className={`inline-flex items-center px-6 py-3 mt-4 sm:mt-6 text-base font-medium text-white bg-brand rounded-lg focus:ring-4 focus:ring-primary-200 transition duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSubmitting}
                        >
                            {mode === "edit" ? (isEditing ? "Guardar Cambios" : "Modificar Usuario") : "Crear Usuario"}
                        </button>
                    </div>
                </div>
            </form>

            {showModal && (
                <ConfirmationModal
                    onCancel={() => setShowModal(false)}
                    onConfirm={handleConfirmSave}
                    message={mode === "edit" ? "¿Estás seguro de guardar los cambios?" : "¿Estás seguro de crear este usuario?"}
                    loading={isSubmitting}
                />
            )}
            <ToastContainer />
        </div>
    );
}
