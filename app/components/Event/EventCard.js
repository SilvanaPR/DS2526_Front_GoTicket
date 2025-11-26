'use client';
import Link from 'next/link';

export default function EventCard({ event, onDeleteClick }) {
  const firstFunction = event.functions?.[0];
  const dateRange = firstFunction
    ? new Date(firstFunction.startDate).toLocaleDateString() +
    ' - ' +
    new Date(firstFunction.endDate).toLocaleDateString()
    : 'Sin fecha';
  const city = firstFunction?.venue?.location?.city;
  const country = firstFunction?.venue?.location?.country;
  const minZonePrice = event.zones?.length
    ? Math.min(...event.zones.map(z => z.price))
    : null;


  const placeholder = '/GoTicketIcon.jpg';
  const imgSrc = event.image
    ? (event.image.startsWith('http') ? event.image : event.image.startsWith('/') ? event.image : `/${event.image}`)
    : placeholder;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {/* IMAGE (placeholder) */}
      <div className="h-56 w-full flex items-center justify-center bg-gray-50 rounded-lg">
        <img
          className="object-contain mx-auto h-full"
          src={imgSrc}
          alt={event.name || 'Evento'}
          onError={(e) => { e.currentTarget.src = placeholder; }}
          loading="lazy"
        />
      </div>

      <div className="pt-6">
        {/* STATE TAG  (Para admin)*/}
        <div className="mb-4 flex items-center justify-between gap-4">
          <span className="me-2 rounded bg-brand bg-opacity-20 px-2.5 py-0.5 text-xs font-medium text-brand">
            {event.state}
          </span>
          {minZonePrice !== null && (
            <span className="rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              Desde ${minZonePrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* TITLE */}
        <Link
          href={`/Event/${event.id}`}
          className="text-lg font-semibold leading-tight text-gray-900 hover:underline"
        >
          {event.name}
        </Link>

        {/* DESCRIPTION */}
        <div className="mt-2 text-sm font-medium text-gray-500 break-words line-clamp-3">
          {event.description || 'Sin descripción'}
        </div>


        {/* ZONES COUNT */}
        <div className="mt-2 text-xs text-gray-500">
          {event.zones?.length
            ? `${event.zones.length} zona(s)`
            : 'Sin zonas'}
        </div>

        {/* ACTIONS */}
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-xl font-extrabold leading-tight text-gray-900">
            {minZonePrice !== null ? `Desde $${minZonePrice.toFixed(2)}` : ''}
          </p>

          <div className="flex items-center justify-end gap-1">
            <Link
              href={`/Event/${event.id}`}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
              <span className="sr-only">Ver detalle</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l9-6v18l-9-6V9Z" />
              </svg>
            </Link>

            <button
              type="button"
              id={`Delete-${event.id}`}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              onClick={onDeleteClick}
            >
              <span className="sr-only">Borrar</span>
              <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM3 5h18M19 7l-.866 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7h14Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}