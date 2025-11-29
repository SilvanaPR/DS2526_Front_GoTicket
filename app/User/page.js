"use client";
import React, { useEffect } from "react";
import Configuration from "../components/User/Configuration";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchUserById } from "../../lib/features/user/userSlice";

export default function UserConfiguration() {
  const router = useRouter();
  const dispatch = useDispatch();

  const authUserId = useSelector((s) => s.auth.userInfo?.sub);
  const loading = useSelector((s) => s.user.loading) || false;
  const currentUser = useSelector((s) => s.user.currentUser) || null;

  useEffect(() => {
    if (!authUserId) {
      // sin token, envía al login
      router.push("/Login");
      return;
    }
    // trae del backend los datos del usuario loggeado
    dispatch(fetchUserById(String(authUserId)));
  }, [authUserId, dispatch, router]);

  if (!authUserId || (loading && !currentUser)) {
    return <div className="p-6 text-sm text-gray-600">Cargando usuario...</div>;
  }

  return <Configuration mode="edit" initialUser={currentUser} />;
}

