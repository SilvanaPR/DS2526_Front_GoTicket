"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import RegisterModal from "../../components/User/Create";
//import { fetchUser } from "../../lib/features/user/userSlice";

export default function UserConfiguration() {
    const dispatch = useDispatch();
    //const user = useSelector((state) => state.user.currentUser);

    useEffect(() => {
        //dispatch(fetchUser());
    }, []);

    return <RegisterModal />;
}