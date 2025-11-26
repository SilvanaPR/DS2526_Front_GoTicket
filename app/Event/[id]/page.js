"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvent, fetchEventFunctions } from "../../../lib/features/event/eventSlice";
import { useParams } from "next/navigation";
import EventView from "../../components/Event/EventView";

export default function Manage() {
    const dispatch = useDispatch();
    const params = useParams();
    const id = params?.id;

    // Usa selectedEvent del slicer
    const currentEvent = useSelector((state) => state.event.selectedEvent);

    useEffect(() => {
        if (!id) return;
        dispatch(fetchEvent({ id }));
        dispatch(fetchEventFunctions({ eventId: id }));
    }, [dispatch, id]);

    return <EventView event={currentEvent} />;
}
