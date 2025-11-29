"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { loginWithPassword } from "../../lib/features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

export default function Login() {
    const dispatch = useDispatch();
    const router = useRouter();
    const authLoading = useSelector(s => s.auth.loading);
    const authError = useSelector(s => s.auth.error);
    const authUserInfo = useSelector(s => s.auth.userInfo);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        if (!email || !password) return;
        const res = await dispatch(loginWithPassword({ username: email, password }));
        if (res.error) return;
        // res.payload contiene el access_token
        try {
            const info = jwtDecode(res.payload);
        } catch { }
        router.push("/Event");
    }

    return (
        <section className="px-6 py-8 mx-auto">
            <div className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)]">
                <div className="w-full bg-white rounded-lg shadow sm:max-w-md">
                    <div className="p-6 space-y-4 md:space-y-6">
                        <div className="flex justify-center mb-2">
                            <Image
                                src="/GoticketBanner.jpg"
                                alt="GoTicket"
                                width={240}
                                height={70}
                                priority
                                className="w-auto h-auto"
                            />
                        </div>

                        <h1 className="text-xl font-bold text-center text-gray-900">Inicio de Sesión</h1>

                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Correo electrónico</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                                    placeholder="usuario@gmail.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Contraseña</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {authError && (
                                <p className="text-sm text-red-600">{authError}</p>
                            )}

                            <div className="sm:col-span-2 group mb-2 flex justify-center">
                                <button
                                    type="submit"
                                    className={`inline-flex items-center px-6 py-3 mt-2 text-base font-medium text-white bg-brand rounded-lg focus:ring-4 focus:ring-primary-200 transition duration-200 ${authLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={authLoading}
                                >
                                    {authLoading ? "Procesando..." : "Iniciar Sesión"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}


