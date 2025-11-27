"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../lib/features/user/userSlice";
import { useRouter } from "next/navigation";

export default function UserListPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const users = useSelector((s) => s.user.users) || [];
    const loading = useSelector((s) => s.user.loading) || false;

    useEffect(() => {
        if (!users.length) dispatch(fetchUsers());
    }, [dispatch, users.length]);

    return (
        <div className="min-h-screen w-full flex flex-col gap-6 bg-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900">Usuarios</h2>

            <div className="overflow-x-auto rounded-lg border bg-white shadow">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium">Nombre</th>
                            <th className="px-4 py-3 text-left font-medium">Email</th>
                            <th className="px-4 py-3 text-left font-medium">Teléfono</th>
                            <th className="px-4 py-3 text-left font-medium">Dirección</th>
                            <th className="px-4 py-3 text-left font-medium">Tipo</th>
                            <th className="px-4 py-3 text-left font-medium">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading && (
                            <tr>
                                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                                    Cargando usuarios...
                                </td>
                            </tr>
                        )}

                        {!loading && users.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                                    No hay usuarios.
                                </td>
                            </tr>
                        )}

                        {!loading && users.map(u => (
                            <tr key={String(u.userId ?? u.id ?? u.userEmail)} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">
                                    {u.userName} {u.userLastName}
                                </td>
                                <td className="px-4 py-3 text-gray-700">{u.userEmail}</td>
                                <td className="px-4 py-3 text-gray-700">{u.userPhoneNumber}</td>
                                <td className="px-4 py-3 text-gray-700">{u.userDirection}</td>
                                <td className="px-4 py-3">
                                    <span className="inline-flex items-center rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                                        {u.userType}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            aria-label="Editar usuario"
                                            className="inline-flex items-center justify-center rounded bg-brandBlue px-2 py-2 text-white hover:opacity-90"
                                            onClick={() => router.push(`/User/${u.userId ?? u.id}`)}
                                        >
                                            <svg className="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Eliminar usuario"
                                            className="inline-flex items-center justify-center rounded bg-brand px-2 py-2 text-white hover:opacity-90"
                                            onClick={() => console.log("Eliminar", u.userId)}
                                        >
                                            <svg className="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}