import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiEvent } from '../../axios';
import { getAuthData } from '../../utils/authHelpers';

type EventStatus = 'CREATED' | 'AVAILABLE' | 'FINISHED' | string;

export interface Location {
    country: string;
    city: string;
}

export interface Venue {
    id?: string;              // ADD
    name: string;
    capacity: number;
    address: string;
    location: Location;
}

export interface EventFunction {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    venue: Venue;
}

export interface Zone {
    id: string;       // GUID
    name: string;
    price: number;
}

export interface Event {
    id: string;       // GUID
    name: string;
    description: string;
    state: EventStatus;
    image: string;    // URL de imagen
    zones: Zone[];
    functions: EventFunction[];
}

export interface Country {
    code: string;
    name: string;
    cities: string[];
}

type EventsState = {
    events: Event[];
    loadingEvents: boolean;
    error?: string;
    selectedEvent?: Event | null;
    loadingEvent: boolean;
    eventFunctions: EventFunction[];
    loadingFunctions: boolean;
    countries: Country[];
    loadingCountries: boolean;
    cities: string[];
    loadingCities: boolean;
    venues: Venue[];              // ADD
    loadingVenues: boolean;       // ADD
};

const initialState: EventsState = {
    events: [],
    loadingEvents: false,
    error: undefined,
    selectedEvent: null,
    loadingEvent: false,
    eventFunctions: [],
    loadingFunctions: false,
    countries: [],
    loadingCountries: false,
    cities: [],
    loadingCities: false,
    venues: [],                   // ADD
    loadingVenues: false,         // ADD
};

// -------------------- MOCK --------------------
export const mockEvents: Event[] = [
    {
        id: 'a2f0e3b8-7c0f-4f44-9a21-1f6a9e0e0001',
        name: 'Concierto Sinfónico',
        description: 'Temporada de apertura de la orquesta.',
        state: 'AVAILABLE',
        image: '/images/event-placeholder.png',
        zones: [
            { id: 'z-100', name: 'Platea', price: 75.0 },
            { id: 'z-101', name: 'Palco', price: 120.0 },
        ],
        functions: [
            {
                name: 'Función 1',
                description: 'Noche de estreno',
                startDate: '2025-12-05T20:00:00.000Z',
                endDate: '2025-12-05T22:30:00.000Z',
                venue: {
                    name: 'Teatro Principal',
                    capacity: 1500,
                    address: 'Av. Central 1234',
                    location: { country: 'Argentina', city: 'Buenos Aires' },
                },
            },
        ],
    },
    {
        id: 'a2f0e3b8-7c0f-4f44-9a21-1f6a9e0e0002',
        name: 'Feria de Tecnología',
        description: 'Exposición de startups e innovación.',
        state: 'CREATED',
        image: '/images/event-placeholder.png',
        zones: [
            { id: 'z-200', name: 'General', price: 20.0 },
            { id: 'z-201', name: 'VIP', price: 60.0 },
        ],
        functions: [
            {
                name: 'Apertura',
                description: 'Ceremonia y keynote',
                startDate: '2026-01-10T10:00:00.000Z',
                endDate: '2026-01-10T18:00:00.000Z',
                venue: {
                    name: 'Centro de Convenciones',
                    capacity: 5000,
                    address: 'Ruta 9 km 12',
                    location: { country: 'Argentina', city: 'Córdoba' },
                },
            },
        ],
    },
];

export async function fetchEventsMock(): Promise<Event[]> {
    await new Promise((r) => setTimeout(r, 300));
    return mockEvents;
}

const normalizeState = (s: unknown): EventStatus => {
    if (typeof s !== 'string') return 'CREATED';
    const upper = s.trim().toUpperCase();
    // Soporta: Creado/Disponible/Terminado o inglés
    if (['CREATED', 'CREADO'].includes(upper)) return 'CREATED';
    if (['AVAILABLE', 'DISPONIBLE'].includes(upper)) return 'AVAILABLE';
    if (['FINISHED', 'TERMINADO'].includes(upper)) return 'FINISHED';
    return upper;
};

// Normalizador (reutilizable)
const normalizeEvent = (e: any): Event => ({
    id: String(e.id ?? e.eventId ?? crypto.randomUUID?.() ?? `${Date.now()}`),
    name: String(e.name ?? ''),
    description: String(e.description ?? ''),
    state: normalizeState(e.state),
    image: String(e.image ?? e.eventImage ?? '/images/event-placeholder.png'),
    zones: ((e.zones ?? e.zone) ?? []).map((z: any): Zone => ({
        id: String(z.id ?? z.zoneId ?? crypto.randomUUID?.() ?? `${Date.now()}`),
        name: String(z.name ?? ''),
        price: Number(z.price ?? 0),
    })),
    functions: ((e.functions ?? e.function) ?? []).map((f: any): EventFunction => ({
        name: String(f.name ?? ''),
        description: String(f.description ?? ''),
        startDate: String(f.startDate ?? f.fechaInicio ?? f.start_date ?? new Date().toISOString()),
        endDate: String(f.endDate ?? f.fechaFin ?? f.end_date ?? new Date().toISOString()),
        venue: {
            name: String(f.venue?.name ?? f.lugar?.name ?? ''),
            capacity: Number(f.venue?.capacity ?? f.lugar?.capacity ?? 0),
            address: String(f.venue?.address ?? f.lugar?.direccion ?? ''),
            location: {
                country: String(
                    f.venue?.location?.country ??
                    f.lugar?.ubicacionGeografica?.pais ??
                    f.lugar?.location?.country ?? ''
                ),
                city: String(
                    f.venue?.location?.city ??
                    f.lugar?.ubicacionGeografica?.ciudad ??
                    f.lugar?.location?.city ?? ''
                ),
            },
        },
    })),
});

export const fetchEvents = createAsyncThunk<Event[]>(
    'events/fetchEvents',
    async (_, { rejectWithValue }) => {
        try {
            if (process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
                return await fetchEventsMock();
            }

            const { userId } = getAuthData();
            const { data } = await apiEvent.get(`/events?userId=${userId}`);

            return (Array.isArray(data) ? data : []).map((e: any): Event => ({
                id: String(e.id ?? e.eventId ?? crypto.randomUUID?.() ?? `${Date.now()}`),
                name: String(e.name ?? ''),
                description: String(e.description ?? ''),
                state: normalizeState(e.state),
                image: String(e.image ?? e.eventImage ?? '/images/event-placeholder.png'),
                zones: ((e.zones ?? e.zone) ?? []).map((z: any): Zone => ({
                    id: String(z.id ?? z.zoneId ?? crypto.randomUUID?.() ?? `${Date.now()}`),
                    name: String(z.name ?? ''),
                    price: Number(z.price ?? 0),
                })),
                functions: ((e.functions ?? e.function) ?? []).map((f: any): EventFunction => ({
                    name: String(f.name ?? ''),
                    description: String(f.description ?? ''),
                    startDate: String(f.startDate ?? f.fechaInicio ?? f.start_date ?? new Date().toISOString()),
                    endDate: String(f.endDate ?? f.fechaFin ?? f.end_date ?? new Date().toISOString()),
                    venue: {
                        name: String(f.venue?.name ?? f.lugar?.name ?? ''),
                        capacity: Number(f.venue?.capacity ?? f.lugar?.capacity ?? 0),
                        address: String(f.venue?.address ?? f.lugar?.direccion ?? ''),
                        location: {
                            country: String(
                                f.venue?.location?.country ??
                                f.lugar?.ubicacionGeografica?.pais ??
                                f.lugar?.location?.country ??
                                ''
                            ),
                            city: String(
                                f.venue?.location?.city ??
                                f.lugar?.ubicacionGeografica?.ciudad ??
                                f.lugar?.location?.city ??
                                ''
                            ),
                        },
                    },
                })),
            }));
        } catch (err: any) {
            return rejectWithValue(err?.message ?? 'Error al cargar eventos');
        }
    }
);

// -------------------- NUEVOS THUNKS --------------------
export const fetchEvent = createAsyncThunk<Event, { id: string }>(
    'events/fetchEvent',
    async ({ id }, { rejectWithValue }) => {
        try {
            if (process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
                const found = mockEvents.find(m => m.id === id);
                if (!found) throw new Error('Evento no encontrado');
                return found;
            }
            const { userId } = getAuthData();
            const { data } = await apiEvent.get(`/events/${id}?userId=${userId}`);
            return normalizeEvent(data);
        } catch (err: any) {
            return rejectWithValue(err?.message ?? 'Error al cargar evento');
        }
    }
);

export const fetchEventFunctions = createAsyncThunk<EventFunction[], { eventId: string }>(
    'events/fetchEventFunctions',
    async ({ eventId }, { rejectWithValue }) => {
        try {
            if (process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
                const ev = mockEvents.find(e => e.id === eventId);
                return ev?.functions ?? [];
            }
            const { data } = await apiEvent.get(`/events/${eventId}/functions`);
            const list = Array.isArray(data) ? data : [];
            return list.map((f: any): EventFunction => ({
                name: String(f.name ?? ''),
                description: String(f.description ?? ''),
                startDate: String(f.startDate ?? f.fechaInicio ?? f.start_date ?? new Date().toISOString()),
                endDate: String(f.endDate ?? f.fechaFin ?? f.end_date ?? new Date().toISOString()),
                venue: {
                    name: String(f.venue?.name ?? f.lugar?.name ?? ''),
                    capacity: Number(f.venue?.capacity ?? f.lugar?.capacity ?? 0),
                    address: String(f.venue?.address ?? f.lugar?.direccion ?? ''),
                    location: {
                        country: String(
                            f.venue?.location?.country ??
                            f.lugar?.ubicacionGeografica?.pais ??
                            f.lugar?.location?.country ?? ''
                        ),
                        city: String(
                            f.venue?.location?.city ??
                            f.lugar?.ubicacionGeografica?.ciudad ??
                            f.lugar?.location?.city ?? ''
                        ),
                    },
                },
            }));
        } catch (err: any) {
            return rejectWithValue(err?.message ?? 'Error al cargar funciones');
        }
    }
);

export const createEvent = createAsyncThunk<Event, { event: Partial<Event> }>(
    'events/createEvent',
    async ({ event }, { rejectWithValue }) => {
        try {
            if (process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
                const mockCreated: Event = {
                    id: crypto.randomUUID?.() ?? `${Date.now()}`,
                    name: event.name ?? '',
                    description: event.description ?? '',
                    state: normalizeState(event.state ?? 'CREATED'),
                    image: event.image ?? '/images/event-placeholder.png',
                    zones: event.zones ?? [],
                    functions: event.functions ?? [],
                };
                return mockCreated;
            }
            const { userId } = getAuthData();
            const payload = { ...event, userId };
            const { data } = await apiEvent.post('/events', payload);
            return normalizeEvent(data);
        } catch (err: any) {
            return rejectWithValue(err?.message ?? 'Error al crear evento');
        }
    }
);

export const updateEvent = createAsyncThunk<Event, { id: string; event: Partial<Event> }>(
    'events/updateEvent',
    async ({ id, event }, { rejectWithValue }) => {
        try {
            if (process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
                const updated: Event = {
                    id,
                    name: event.name ?? 'Actualizado',
                    description: event.description ?? '',
                    state: normalizeState(event.state ?? 'AVAILABLE'),
                    image: event.image ?? '/images/event-placeholder.png',
                    zones: event.zones ?? [],
                    functions: event.functions ?? [],
                };
                return updated;
            }
            const { userId } = getAuthData();
            const payload = { ...event, userId };
            const { data } = await apiEvent.put(`/events/${id}`, payload);
            return normalizeEvent(data);
        } catch (err: any) {
            return rejectWithValue(err?.message ?? 'Error al actualizar evento');
        }
    }
);

// -------------------- MOCK COUNTRIES/CITIES --------------------
export const mockCountries: Country[] = [
    {
        code: 'AR',
        name: 'Argentina',
        cities: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza']
    },
    {
        code: 'CL',
        name: 'Chile',
        cities: ['Santiago', 'Valparaíso', 'Concepción']
    },
    {
        code: 'UY',
        name: 'Uruguay',
        cities: ['Montevideo', 'Punta del Este', 'Colonia']
    },
    {
        code: 'BR',
        name: 'Brasil',
        cities: ['São Paulo', 'Rio de Janeiro', 'Brasilia']
    }
];

export const fetchCountries = createAsyncThunk<Country[]>(
    'events/fetchCountries',
    async (_, { rejectWithValue }) => {
        try {
            if (process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
                await new Promise(r => setTimeout(r, 200));
                return mockCountries;
            }
            const { data } = await apiEvent.get('/locations/countries');
            return (Array.isArray(data) ? data : []).map((c: any) => ({
                code: String(c.code ?? c.iso ?? ''),
                name: String(c.name ?? ''),
                cities: Array.isArray(c.cities) ? c.cities.map((ct: any) => String(ct)) : []
            }));
        } catch (err: any) {
            return rejectWithValue(err?.message ?? 'Error al cargar países');
        }
    }
);

export const fetchCities = createAsyncThunk<string[], { countryCode: string }>(
    'events/fetchCities',
    async ({ countryCode }, { rejectWithValue, getState }) => {
        try {
            if (process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
                await new Promise(r => setTimeout(r, 200));
                const country = mockCountries.find(c => c.code === countryCode);
                if (!country) throw new Error('País no encontrado');
                return country.cities;
            }
            const { data } = await apiEvent.get(`/locations/countries/${countryCode}/cities`);
            return (Array.isArray(data) ? data : []).map(ct => String(ct));
        } catch (err: any) {
            const state = getState() as { event: EventsState };
            const fallback = state.event.countries.find(c => c.code === countryCode);
            if (fallback) return fallback.cities;
            return rejectWithValue(err?.message ?? 'Error al cargar ciudades');
        }
    }
);

// -------------------- EXPANDED MOCK VENUES
export const mockVenues: Venue[] = [
    {
        id: 'venue-001',
        name: 'Teatro Principal',
        capacity: 1500,
        address: 'Av. Central 1234',
        location: { country: 'Argentina', city: 'Buenos Aires' }
    },
    {
        id: 'venue-002',
        name: 'Centro de Convenciones',
        capacity: 5000,
        address: 'Ruta 9 km 12',
        location: { country: 'Argentina', city: 'Córdoba' }
    },
    {
        id: 'venue-003',
        name: 'Arena Metropolitana',
        capacity: 12000,
        address: 'Av. Tech 500',
        location: { country: 'Chile', city: 'Santiago' }
    },
    {
        id: 'venue-004',
        name: 'Auditorio Innovación',
        capacity: 900,
        address: 'Calle Ciencia 77',
        location: { country: 'Uruguay', city: 'Montevideo' }
    },
    {
        id: 'venue-005',
        name: 'Pabellón Expo Norte',
        capacity: 3500,
        address: 'Av. Industrial 2200',
        location: { country: 'Brasil', city: 'São Paulo' }
    }
];

export async function fetchVenuesMock(): Promise<Venue[]> {
    await new Promise(r => setTimeout(r, 250));
    return mockVenues;
}

export const fetchVenues = createAsyncThunk<Venue[]>(
    'events/fetchVenues',
    async (_, { rejectWithValue }) => {
        try {
            if (process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
                return await fetchVenuesMock();
            }
            const { data } = await apiEvent.get('/venues');
            return (Array.isArray(data) ? data : []).map((v: any) => ({
                id: String(v.id ?? v.venueId ?? (crypto.randomUUID?.() ?? `${String(v.name ?? '').toLowerCase().replace(/\s+/g, '-')}`)), // ADD
                name: String(v.name ?? ''),
                capacity: Number(v.capacity ?? 0),
                address: String(v.address ?? ''),
                location: {
                    country: String(v.location?.country ?? ''),
                    city: String(v.location?.city ?? '')
                }
            }));
        } catch (err: any) {
            return rejectWithValue(err?.message ?? 'Error al cargar venues');
        }
    }
);

// -------------------- SLICE --------------------
const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        setEvents(state, action: PayloadAction<Event[]>) {
            state.events = action.payload;
        },
        clearEvents(state) {
            state.events = [];
            state.selectedEvent = null;
            state.eventFunctions = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Lista
            .addCase(fetchEvents.pending, (state) => {
                state.loadingEvents = true;
                state.error = undefined;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.loadingEvents = false;
                state.events = action.payload;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loadingEvents = false;
                state.error = (action.payload as string) ?? action.error.message ?? 'Error al cargar eventos';
            })

            // Uno
            .addCase(fetchEvent.pending, (state) => {
                state.loadingEvent = true;
                state.error = undefined;
            })
            .addCase(fetchEvent.fulfilled, (state, action) => {
                state.loadingEvent = false;
                state.selectedEvent = action.payload;
            })
            .addCase(fetchEvent.rejected, (state, action) => {
                state.loadingEvent = false;
                state.error = (action.payload as string) ?? action.error.message ?? 'Error al cargar evento';
            })

            // Funciones
            .addCase(fetchEventFunctions.pending, (state) => {
                state.loadingFunctions = true;
            })
            .addCase(fetchEventFunctions.fulfilled, (state, action) => {
                state.loadingFunctions = false;
                state.eventFunctions = action.payload;
            })
            .addCase(fetchEventFunctions.rejected, (state, action) => {
                state.loadingFunctions = false;
                state.error = (action.payload as string) ?? action.error.message ?? 'Error al cargar funciones';
            })

            // Crear
            .addCase(createEvent.fulfilled, (state, action) => {
                state.events.push(action.payload);
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.error = (action.payload as string) ?? action.error.message ?? 'Error al crear evento';
            })

            // Actualizar
            .addCase(updateEvent.fulfilled, (state, action) => {
                state.events = state.events.map(ev => ev.id === action.payload.id ? action.payload : ev);
                if (state.selectedEvent?.id === action.payload.id) {
                    state.selectedEvent = action.payload;
                }
            })
            .addCase(updateEvent.rejected, (state, action) => {
                state.error = (action.payload as string) ?? action.error.message ?? 'Error al actualizar evento';
            })
            .addCase(fetchCountries.pending, (state) => {
                state.loadingCountries = true;
            })
            .addCase(fetchCountries.fulfilled, (state, action) => {
                state.loadingCountries = false;
                state.countries = action.payload;
            })
            .addCase(fetchCountries.rejected, (state, action) => {
                state.loadingCountries = false;
                state.error = (action.payload as string) ?? action.error.message ?? 'Error al cargar países';
            })
            .addCase(fetchCities.pending, (state) => {
                state.loadingCities = true;
                state.cities = [];
            })
            .addCase(fetchCities.fulfilled, (state, action) => {
                state.loadingCities = false;
                state.cities = action.payload;
            })
            .addCase(fetchCities.rejected, (state, action) => {
                state.loadingCities = false;
                state.error = (action.payload as string) ?? action.error.message ?? 'Error al cargar ciudades';
            })
            .addCase(fetchVenues.pending, (state) => {
                state.loadingVenues = true;
            })
            .addCase(fetchVenues.fulfilled, (state, action: PayloadAction<Venue[]>) => {
                state.loadingVenues = false;
                // garantiza ids si faltan (BACKUP)
                state.venues = action.payload.map((v, i) => ({
                    ...v,
                    id: v.id ?? `venue-${i + 1}`
                }));
            })
            .addCase(fetchVenues.rejected, (state, action) => {
                state.loadingVenues = false;
                state.error = (action.payload as string) ?? action.error.message ?? 'Error al cargar venues';
            });
    },
});

export const { setEvents, clearEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
