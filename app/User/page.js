"use client";
import React, { useEffect } from "react";
import Configuration from "../components/User/Configuration";
import { useSelector, useDispatch } from 'react-redux';
// import { fetchUsers } from "../../lib/features/user/userSlice";

export default function UserConfiguration() {
  const dispatch = useDispatch();
  // const currentUser = useSelector((state) => state.user.currentUser);

  // Mock de usuario con campos que espera Configuration (userName, userLastName, etc.)
  const initialUser = {
    userId: "123",
    userEmail: "silvana@example.com",
    userType: "ADMIN",
    userPassword: "123456",
    userName: "Silvana",
    userPhoneNumber: "+58 414 555 1234",
    userDirection: "Caracas, Venezuela",
    userLastName: "Peña",
  };

  useEffect(() => {
    // Si lo traes del backend:
    // dispatch(fetchUsers());
    // y luego seleccionas el usuario en el store.
  }, [dispatch]);

  // Usa Configuration en modo edición y le pasa initialUser
  return <Configuration mode="edit" initialUser={initialUser} />;
}

