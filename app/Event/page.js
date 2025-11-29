"use client";
import React, { useState, useEffect } from "react";
import EventCard from "../components/Event/EventCard";
import { useSelector, useDispatch } from "react-redux";
import { fetchEvents } from "../../lib/features/event/eventSlice";
import { ToastContainer, toast } from "react-toastify";
import SearchBar from "../components/SearchBar";
import ConfirmationModal from "../components/ConfirmationModal";

export default function EventPage() {
  const dispatch = useDispatch();
  const events = useSelector(s => s?.events?.events ?? []);
  const loading = useSelector(s => s?.events?.loading ?? false);
  const error = useSelector(s => s?.events?.error ?? null);

  const [eventsList, setEventList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 8;
  const [showModal, setShowModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = eventsList.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(eventsList.length / eventsPerPage);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    setEventList(
      (events || []).map(e => ({
        ...e,
        function_name: e.functions?.[0]?.name || ''
      }))
    );
  }, [events]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = (ev) => {
    setEventToDelete(ev);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    setLoadingDelete(true);
    try {
      toast.success('Evento eliminado correctamente', {
        position: "bottom-right",
        className: 'text-medium py-6 px-8 rounded-md shadow-lg bg-green-100 text-green-700',
        autoClose: 3001,
        closeOnClick: true,
        draggable: true,
      });
    } catch (error) {
      toast.error('No se pudo eliminar el evento', {
        position: "bottom-right",
        className: 'text-medium py-6 px-8 rounded-md shadow-lg bg-red-100 text-red-700',
        autoClose: 3001,
        closeOnClick: true,
        draggable: true,
      });
    } finally {
      setLoadingDelete(false);
      setShowModal(false);
      setEventToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setEventToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-brand border-e-transparent" role="status">
          <span className="sr-only">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-8 antialiased md:py-12">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mb-8">
          <SearchBar functions={["Todos", "Nombre", "Categoría", "Precio"]} />
        </div>

        <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
          {currentEvents.map(ev => (
            <EventCard
              key={ev.id}
              event={ev}
              onDeleteClick={() => confirmDelete(ev)}
            />
          ))}
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(number => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-4 py-2 rounded-md text-sm font-medium border ${currentPage === number ? 'bg-brand text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
            >
              {number}
            </button>
          ))}
        </div>

        {showModal && (
          <ConfirmationModal
            onCancel={handleCancelDelete}
            onConfirm={handleConfirmDelete}
            message={"¿Estás seguro de eliminar este evento?"}
            loading={loadingDelete}
          >
            {loadingDelete ? (
              <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent text-red-600" role="status">
                <span className="sr-only">Eliminando...</span>
              </div>
            ) : "Eliminar"}
          </ConfirmationModal>
        )}

        <ToastContainer />
      </div>
    </section>
  );
}
