"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvent, fetchEventFunctions } from "../../../../lib/features/event/eventSlice";
import { useParams } from "next/navigation";
import EventDetail from "../../../components/Event/EventDetail";


export default function EventDetailPage() {
    const dispatch = useDispatch();
    const params = useParams();
    const id = params?.id;

    const currentEvent = useSelector((state) => state.events?.selectedEvent);

    useEffect(() => {
        if (!id) return;
        dispatch(fetchEvent({ id }));
        dispatch(fetchEventFunctions({ eventId: id }));
    }, [dispatch, id]);

    return <EventDetail event={currentEvent} />;
}
