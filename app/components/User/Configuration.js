"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import ConfirmationModal from '../ConfirmationModal';
import ImageReader from "../ImageReader";
//import { saveUser } from "@/lib/features/user/userSlice";
import { Datepicker } from "flowbite";

export default function Configuration(user) {

    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const datepickerRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        email: '',
        type: '',
        phone: '',
        address: '',
        password: ''
    });

    const userTypes = [
        { value: 'ADMIN', label: 'Admin' },
        { value: 'CLIENT', label: 'Cliente' },
        { value: 'ORGANIZER', label: 'Organizador' },
    ];

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.user.userName || '',
                email: user.user.userEmail || '',
                type: user.user.usersType || '',
                phone: user.user.userPhone || '',
                address: user.user.userAddress || '',
                lastName: user.user.userLastName || '',
                birthday: user.user.userBirthday || '',
                password: '',
                specialization: user.user.userSpecialization || '',
                auctioneerDelete: false,
                bidderDelete: false,
                supportDelete: false
            });
        }
    }, [user]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isEditing) {
            setIsEditing(true);
            return;
        }
        setShowModal(true);
    };

    function buildUserPayload(formData, userType, isEdit) {
        const base = {
            userEmail: formData.email,
            userName: formData.name,
            userLastName: formData.lastName,
            userPhone: formData.phone,
            userAddress: formData.address,
        };

        return base;
    }

    const handleConfirmSave = async () => {

        console.log(formData);
        setShowModal(false);
        try {
            setIsSubmitting(true);

            const userType = formData.type;
            const isEdit = isEditing;
            const payload = buildUserPayload(formData, userType, isEdit);

            await dispatch(saveUser(payload));
            toast.success("Cambios guardados correctamente", {
                position: "bottom-right",
                className:
                    "text-medium py-6 px-8 rounded-md shadow-lg bg-green-100 text-green-700",
            });
            setIsEditing(false);
        } catch (err) {
            toast.error("Error al guardar los cambios");
        } finally {
            setIsSubmitting(false);
        }
    };



    return (

        <div className="items-center justify-center h-screen w-full">
            <form onSubmit={handleSubmit}>
                <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16 bg-white rounded-lg shadow grid gap-4 sm:grid-cols-2 sm:gap-6">


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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                            disabled={!isEditing}
                        />
                    </div>

                    {/* ADRESS */}
                    <div className="sm:col-span-2 group mb-4">
                        <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">Dirección</label>
                        <textarea
                            id="address"
                            name="address"
                            rows="8"
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                            required
                            value={formData.address}
                            onChange={handleChange}
                            disabled={!isEditing}
                        ></textarea>
                    </div>


                    {/* USER TYPE (solo para admins) */}
                    <div className="sm:col-span-2 group mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Tipo de Usuario</label>
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
                    </div>


                    <div className="sm:col-span-2 group mb-4">
                        <button
                            type="submit"
                            className={`inline-flex items-center px-6 py-3 mt-4 sm:mt-6 text-base font-medium text-white bg-brand rounded-lg focus:ring-4 focus:ring-primary-200 transition duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSubmitting}
                        >
                            {isEditing ? 'Guardar Cambios' : 'Modificar Usuario'}
                        </button>
                    </div>
                </div >
            </form >
            {showModal && (
                <ConfirmationModal
                    onCancel={() => setShowModal(false)}
                    onConfirm={handleConfirmSave}
                    message={"¿Estás seguro de guardar los cambios?"}
                    loading={isSubmitting}
                />
            )}
            <ToastContainer />
        </div >

    );
}
