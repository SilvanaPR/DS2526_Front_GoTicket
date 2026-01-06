'use client'
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../lib/features/auth/authSlice";
import ConfirmationModal from "./ConfirmationModal"; // <-- add
import { fetchUserById } from "../../lib/features/user/userSlice"; // <-- add

export default function Sidenav({ sidebarOpen, setSidebarOpen }) {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [showEventSubmenu, setShowEventSubmenu] = useState(false);
    const [showConfigurationSubmenu, setShowConfigurationSubmenu] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false); // <-- add
    const sidebar = useRef(null);
    const router = useRouter();
    const dispatch = useDispatch();
    const authInfo = useSelector(s => s.auth?.userInfo);
    const isAuthenticated = useSelector(s => !!s.auth?.token || !!s.auth?.userInfo);
    const currentUser = useSelector(s => s.user.currentUser) || null;


    useEffect(() => {
        const userId = authInfo?.sub;
        if (isAuthenticated && userId && !currentUser) {
            dispatch(fetchUserById(String(userId)));
        }
    }, [isAuthenticated, authInfo?.sub, currentUser, dispatch]);


    const isAdmin = (() => {
        const t = currentUser?.userType?.trim()?.toLowerCase() || "";
        return t === "administrator" || t === "administrador";
    })();

    useEffect(() => {
        if (sidebarExpanded) {
            document.querySelector("body")?.classList.add("sidebar-expanded");
        } else {
            document.querySelector("body")?.classList.remove("sidebar-expanded");
        }
    }, [sidebarExpanded]);

    const handleSideBarChange = async () => {
        setSidebarExpanded(!sidebarExpanded);
        if (!sidebarExpanded) {
            setShowProductSubmenu(false);
            setShowAuctionSubmenu(false);
        }
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        dispatch(logout());
        setShowConfigurationSubmenu(false);
        setSidebarOpen(false);
        setShowLogoutModal(false);


        if (typeof window !== "undefined") {
            window.location.assign("/Login");
        }
    };

    const cancelLogout = () => setShowLogoutModal(false);

    return (
        <>
            {/* Sidebar backdrop */}
            <div
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`fixed inset-0 border-r border-gray-200 sm:translate-x-0 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                aria-hidden="true"
            ></div>

            {/* Sidebar */}
            <div
                id="sidebar"
                ref={sidebar}
                className={`fixed flex flex-col z-40 left-0 top-0 lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar lg:w-64 w-72 bg-white lg:sidebar-expanded:w-20 shrink-0 border-r border-gray-200 sm:translate-x-0 p-4 transition-all duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-72"
                    }`}
            >
                <div className="w-full px-3 sm:px-2 mb-6">
                    {sidebarExpanded ? (
                        <Link href="/" className="block w-full">
                            <Image
                                className="mx-auto h-8 w-8"
                                src="/GoTicketIcon.jpg"
                                height={100}
                                width={100}
                                alt="logo"
                                priority
                            />
                        </Link>
                    ) : (
                        <Link href="/" className="block w-full">
                            <Image
                                src="/GoticketBanner.jpg"
                                alt="logo"
                                width={1200}
                                height={300}
                                className="w-full h-auto object-contain"
                                priority
                            />
                        </Link>
                    )}
                </div>

                {/* Links */}
                <div className="space-y-4">
                    <ul className="space-y-2">
                        {/* PROFILE CONFIGURATION */}
                        <li>
                            <button
                                onClick={() => {
                                    if (!sidebarExpanded) {
                                        setShowConfigurationSubmenu(!showConfigurationSubmenu);
                                    } else {
                                        router.push(isAuthenticated ? "/User" : "/Login");
                                        setSidebarOpen(false);
                                    }
                                }}
                                className="flex items-center w-full p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 font-light hover:font-semibold"
                            >
                                <div className="text-brand stroke-brand">
                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                    </svg>
                                </div>

                                <span className={`${sidebarExpanded ? "lg:hidden opacity-0 ml-0" : "opacity-100 ml-3 block"} ml-3 whitespace-nowrap`}>
                                    Usuario
                                </span>


                                <span className="ml-auto">
                                    {!sidebarExpanded && (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showConfigurationSubmenu ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                                        </svg>
                                    )}
                                </span>
                            </button>

                            {showConfigurationSubmenu && (
                                <ul className="ml-10 mt-1 space-y-1">
                                    {/* Mostrar opciones según autenticación */}
                                    {!isAuthenticated ? (
                                        <>
                                            <li>
                                                <Link
                                                    onClick={() => setSidebarOpen(false)}
                                                    name={Link.name}
                                                    href="/Login"
                                                    className="block p-1 text-sm text-gray-700 hover:text-black hover:font-medium"
                                                >
                                                    <span className="block p-1 text-sm text-gray-700 hover:text-black hover:font-medium">
                                                        <span className={`${sidebarExpanded ? "lg:hidden opacity-0 ml-0" : "opacity-100 block"} ml-3 whitespace-nowrap`}>
                                                            Inicio de Sesión
                                                        </span>
                                                    </span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    onClick={() => setSidebarOpen(false)}
                                                    name={Link.name}
                                                    href="/User/Create"
                                                    className="block p-1 text-sm text-gray-700 hover:text-black hover:font-medium"
                                                >
                                                    <span className="block p-1 text-sm text-gray-700 hover:text-black hover:font-medium">
                                                        <span className={`${sidebarExpanded ? "lg:hidden opacity-0 ml-0" : "opacity-100 block"} ml-3 whitespace-nowrap`}>
                                                            Regístrate
                                                        </span>
                                                    </span>
                                                </Link>
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            {isAuthenticated && (
                                                <>
                                                    <li>
                                                        <Link
                                                            onClick={() => setSidebarOpen(false)}
                                                            name={Link.name}
                                                            href="/User"
                                                            className="block p-1 text-sm text-gray-700 hover:text-black hover:font-medium"
                                                        >
                                                            <span className="block p-1 text-sm text-gray-700 hover:text-black hover:font-medium">
                                                                <span className={`${sidebarExpanded ? "lg:hidden opacity-0 ml-0" : "opacity-100 block"} ml-3 whitespace-nowrap`}>
                                                                    Mi Perfil
                                                                </span>
                                                            </span>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link
                                                            onClick={() => setSidebarOpen(false)}
                                                            name={Link.name}
                                                            href="/User/ChangePassword"
                                                            className="block p-1 text-sm text-gray-700 hover:text-black hover:font-medium"
                                                        >
                                                            <span className="block p-1 text-sm text-gray-700 hover:text-black hover:font-medium">
                                                                <span className={`${sidebarExpanded ? "lg:hidden opacity-0 ml-0" : "opacity-100 block"} ml-3 whitespace-nowrap`}>
                                                                    Cambio de Contraseña
                                                                </span>
                                                            </span>
                                                        </Link>
                                                    </li>

                                                    {isAdmin && (
                                                        <li>
                                                            <Link
                                                                onClick={() => setSidebarOpen(false)}
                                                                name={Link.name}
                                                                href="/User/List"
                                                                className="block p-1 text-sm text-gray-700 hover:text-black hover:font-medium"
                                                            >
                                                                <span className="block p-1 text-sm text-gray-700 hover:text-black hover:font-medium">
                                                                    <span className={`${sidebarExpanded ? "lg:hidden opacity-0 ml-0" : "opacity-100 block"} ml-3 whitespace-nowrap`}>
                                                                        Listado de Usuarios
                                                                    </span>
                                                                </span>
                                                            </Link>
                                                        </li>
                                                    )}

                                                    {/* Cerrar Sesión */}
                                                    <li>
                                                        <button
                                                            type="button"
                                                            onClick={handleLogout}
                                                            className="block w-full text-left p-1 text-sm text-gray-700 hover:text-black hover:font-medium"
                                                        >
                                                            <span className="block p-1 text-sm text-gray-700 hover:text-black hover:font-medium">
                                                                <span className={`${sidebarExpanded ? "lg:hidden opacity-0 ml-0" : "opacity-100 block"} ml-3 whitespace-nowrap`}>
                                                                    Cerrar Sesión
                                                                </span>
                                                            </span>
                                                        </button>
                                                    </li>
                                                </>
                                            )}
                                        </>
                                    )}
                                </ul>
                            )}
                        </li>


                    </ul>

                    <ul className="space-y-2">
                        {/* EVENT CONFIGURATION */}
                        <li>
                            <button
                                onClick={() => {
                                    if (!sidebarExpanded) {
                                        setShowEventSubmenu(!showEventSubmenu);
                                    } else {
                                        router.push("/Event");
                                        setSidebarOpen(false);
                                    }
                                }}
                                className="flex items-center w-full p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 font-light hover:font-semibold"
                            >
                                <div className="text-brand stroke-brand">

                                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.5 12A2.5 2.5 0 0 1 21 9.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2.5a2.5 2.5 0 0 1 0 5V17a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                                    </svg>

                                </div>

                                <span className={`${sidebarExpanded ? "lg:hidden opacity-0 ml-0" : "opacity-100 ml-3 block"} ml-3 whitespace-nowrap`}>
                                    Eventos
                                </span>


                                <span className="ml-auto">
                                    {!sidebarExpanded && (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d={showEventSubmenu ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                                            />
                                        </svg>
                                    )}
                                </span>
                            </button>
                            {showEventSubmenu && (
                                <ul className="ml-10 mt-1 space-y-1">
                                    {/* Siempre visible */}
                                    <li>
                                        <Link
                                            onClick={() => setSidebarOpen(false)}
                                            name={Link.name}
                                            href="/Event"
                                            className="block p-1 text-sm text-gray-700 hover:text-black hover:font-medium"
                                        >
                                            <span className="block p-1 text-sm text-gray-700 hover:text-black hover:font-medium">
                                                <span className={`${sidebarExpanded ? "lg:hidden opacity-0 ml-0" : "opacity-100 block"} ml-3 whitespace-nowrap`}>
                                                    Listado de Eventos
                                                </span>
                                            </span>
                                        </Link>
                                    </li>

                                    {/* Solo si ha iniciado sesión */}
                                    {isAuthenticated && (
                                        <>
                                            <li>
                                                <Link
                                                    onClick={() => setSidebarOpen(false)}
                                                    name={Link.name}
                                                    href="/Event/Create"
                                                    className="block p-1 text-sm text-gray-700 hover:text-black hover:font-medium"
                                                >
                                                    <span className="block p-1 text-sm text-gray-700 hover:text-black hover:font-medium">
                                                        <span className={`${sidebarExpanded ? "lg:hidden opacity-0 ml-0" : "opacity-100 block"} ml-3 whitespace-nowrap`}>
                                                            Crear Evento
                                                        </span>
                                                    </span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    onClick={() => setSidebarOpen(false)}
                                                    name={Link.name}
                                                    href="/Event/Venue"
                                                    className="block p-1 text-sm text-gray-700 hover:text-black hover:font-medium"
                                                >
                                                    <span className="block p-1 text-sm text-gray-700 hover:text-black hover:font-medium">
                                                        <span className={`${sidebarExpanded ? "lg:hidden opacity-0 ml-0" : "opacity-100 block"} ml-3 whitespace-nowrap`}>
                                                            Venues
                                                        </span>
                                                    </span>
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            )}
                        </li>


                    </ul>
                </div>

                {/* Sidebar toggle */}
                <div className="pt-3 lg:inline-flex mt-auto">
                    <div className="flex-1" />
                    <div className="px-3 py-2 justify-end">
                        <button onClick={() => handleSideBarChange()}>
                            <span className="sr-only">Expand / collapse sidebar</span>
                            <svg
                                className={`w-6 h-6 hidden lg:block fill-current ${!sidebarExpanded ? "rotate-0" : "rotate-180"
                                    }`}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M10.5 19.5L3 12M3 12L10.5 4.5M3 12H21"
                                    stroke="#0F172A"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmación de cierre de sesión */}
            {showLogoutModal && (
                <ConfirmationModal
                    onCancel={cancelLogout}
                    onConfirm={confirmLogout}
                    message="¿Deseas cerrar sesión?"
                    loading={false}
                />
            )}
        </>
    );
}
