"use client";
import React, { useEffect } from "react";
import Configuration from "../components/User/Configuration";
import { useSelector, useDispatch } from 'react-redux';
//import { fetchUser } from "../../lib/features/user/userSlice";

export default function UserConfiguration() {
  const dispatch = useDispatch();
  //const user = useSelector((state) => state.user.currentUser);

  const user = {
    userId: "123",
    userEmail: "silvana@example.com",
    usersType: "ADMIN",
    userPassword: "123456",
    userName: "Silvana",
    userPhone: "+58 414 555 1234",
    userAddress: "Caracas, Venezuela",
    userAvailable: "YES",
    userLastName: "Peña",
    userDelete: false
  };

  useEffect(() => {
    //dispatch(fetchUser());
  }, []);

  return <Configuration user={user} />;
}