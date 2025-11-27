"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById } from "../../../lib/features/user/userSlice";
import Configuration from "../../components/User/Configuration";

export default function UserEditPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const loading = useSelector((s) => s.user.loading) || false;
    const initialUser = useSelector((s) => s.user.currentUser);

    useEffect(() => {
        if (id) dispatch(fetchUserById(String(id)));
    }, [dispatch, id]);

    if (loading && !initialUser) {
        return <div className="p-6 text-sm text-gray-600">Cargando usuario...</div>;
    }

    return <Configuration mode="edit" initialUser={initialUser} />;
}