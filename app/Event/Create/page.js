"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchEvent } from "../../../lib/features/event/eventSlice";
import EventView from "../../components/Event/EventView";
import { useParams } from "next/navigation";
//import { useAuth } from '../../../lib/contexts/auth';

export default function Manage() {
    const dispatch = useDispatch();
    const params = useParams();
    const id = params?.id;
    //const { token, userId } = useAuth();
    const currentEvent = useSelector((state) => state.event.currentEvent);
    /*
        useEffect(() => {
            {
            if (token && userId) {
                dispatch(fetchProduct({
                    productId: id,
                    token: token,
                    userId: userId
                }));
    
            } else {
                console.warn("Token o userId no disponibles.");
            }}
        }, [dispatch, token, userId]);
    */
    return <EventView event={currentEvent} />;
}
