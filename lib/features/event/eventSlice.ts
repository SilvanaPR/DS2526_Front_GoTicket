import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiEvent } from "../../axios";
import { getAuthData } from "../../utils/authHelpers";

type EventStatus = "Creado" | "AVAILABLE" | "FINISHED" | string;

export interface Location {
    country: string;
    city: string;
}

export interface Venue {
    id?: string; // ADD
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
    id: string; // GUID
    name: string;
    price: number;
}

export interface Event {
    id: string; // GUID
    name: string;
    description: string;
    state: EventStatus;
    image: string; // URL de imagen
    zones: Zone[];
    functions: EventFunction[];
}

export interface Country {
    code: string;      // countryId
    name: string;      // country name
    cities: string[];  // cities (names)
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
    venues: Venue[]; // ADD
    loadingVenues: boolean; // ADD
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
    venues: [], // ADD
    loadingVenues: false, // ADD
};

// -------------------- MOCK --------------------
export const mockEvents: Event[] = [
    {
        id: "a2f0e3b8-7c0f-4f44-9a21-1f6a9e0e0001",
        name: "Concierto Sinfónico",
        description: "Temporada de apertura de la orquesta.",
        state: "AVAILABLE",
        image: "/images/event-placeholder.png",
        zones: [
            { id: "z-100", name: "Platea", price: 75.0 },
            { id: "z-101", name: "Palco", price: 120.0 },
        ],
        functions: [
            {
                name: "Función 1",
                description: "Noche de estreno",
                startDate: "2025-12-05T20:00:00.000Z",
                endDate: "2025-12-05T22:30:00.000Z",
                venue: {
                    name: "Teatro Principal",
                    capacity: 1500,
                    address: "Av. Central 1234",
                    location: { country: "Argentina", city: "Buenos Aires" },
                },
            },
        ],
    },
    {
        id: "a2f0e3b8-7c0f-4f44-9a21-1f6a9e0e0002",
        name: "Feria de Tecnología",
        description: "Exposición de startups e innovación.",
        state: "Creado",
        image: "/images/event-placeholder.png",
        zones: [
            { id: "z-200", name: "General", price: 20.0 },
            { id: "z-201", name: "VIP", price: 60.0 },
        ],
        functions: [
            {
                name: "Apertura",
                description: "Ceremonia y keynote",
                startDate: "2026-01-10T10:00:00.000Z",
                endDate: "2026-01-10T18:00:00.000Z",
                venue: {
                    name: "Centro de Convenciones",
                    capacity: 5000,
                    address: "Ruta 9 km 12",
                    location: { country: "Argentina", city: "Córdoba" },
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
    if (typeof s !== "string") return "Creado";
    const upper = s.trim().toUpperCase();
    // Soporta: Creado/Disponible/Terminado o inglés
    if (["Creado", "CREADO"].includes(upper)) return "Creado";
    if (["AVAILABLE", "DISPONIBLE"].includes(upper)) return "AVAILABLE";
    if (["FINISHED", "TERMINADO"].includes(upper)) return "FINISHED";
    return upper;
};

// Normalizador (reutilizable)
const normalizeEvent = (e: any): Event => ({
    id: String(e.id ?? e.eventId ?? crypto.randomUUID?.() ?? `${Date.now()}`),
    name: String(e.name ?? ""),
    description: String(e.description ?? ""),
    state: normalizeState(e.state),
    image: String(e.image ?? e.eventImage ?? "/images/event-placeholder.png"),
    zones: ((e.zones ?? e.zone) ?? []).map((z: any): Zone => ({
        id: String(z.id ?? z.zoneId ?? crypto.randomUUID?.() ?? `${Date.now()}`),
        name: String(z.name ?? ""),
        price: Number(z.price ?? 0),
    })),
    functions: ((e.functions ?? e.function) ?? []).map((f: any): EventFunction => ({
        name: String(f.name ?? ""),
        description: String(f.description ?? ""),
        startDate: String(f.startDate ?? f.fechaInicio ?? f.start_date ?? new Date().toISOString()),
        endDate: String(f.endDate ?? f.fechaFin ?? f.end_date ?? new Date().toISOString()),
        venue: {
            name: String(f.venue?.name ?? f.lugar?.name ?? ""),
            capacity: Number(f.venue?.capacity ?? f.lugar?.capacity ?? 0),
            address: String(f.venue?.address ?? f.lugar?.direccion ?? ""),
            location: {
                country: String(
                    f.venue?.location?.country ??
                    f.lugar?.ubicacionGeografica?.pais ??
                    f.lugar?.location?.country ?? ""
                ),
                city: String(
                    f.venue?.location?.city ??
                    f.lugar?.ubicacionGeografica?.ciudad ??
                    f.lugar?.location?.city ?? ""
                ),
            },
        },
    })),
});

export const fetchEvents = createAsyncThunk<Event[]>(
    "events/fetchEvents",
    async (_, { rejectWithValue }) => {
        try {
            // BD: lista de eventos desde /api/event
            const { data } = await apiEvent.get("/api/event");
            const list = Array.isArray(data) ? data : [];

            return list.map((item: any): Event => {
                const ev = item.event ?? {};
                const funcs = Array.isArray(item.functions) ? item.functions : [];
                const zones = Array.isArray(item.zones) ? item.zones : [];

                return {
                    id: String(ev.id ?? ev.eventId ?? ""),
                    name: String(ev.name ?? ""),
                    description: String(ev.description ?? ""),
                    state: normalizeState(ev.status ?? ev.state ?? "Creado"),
                    image: "/images/event-placeholder.png",
                    zones: zones.map((z: any): Zone => ({
                        id: String(z.id ?? z.zoneId ?? ""),
                        name: String(z.name ?? ""),
                        price: Number(z.price ?? 0),
                    })),
                    functions: funcs.map((f: any): EventFunction => ({
                        name: String(f.name ?? ""),
                        description: String(f.description ?? ""),
                        startDate: String(f.startDate ?? ""),
                        endDate: String(f.endDate ?? ""),
                        // El backend solo entrega venueId; se deja venue vacío por ahora.
                        venue: {
                            name: "",
                            capacity: 0,
                            address: "",
                            location: { country: "", city: "" },
                        },
                    })),
                };
            });
        } catch (err: any) {
            return rejectWithValue(err?.message ?? "Error al cargar eventos");
        }
    }
);

// -------------------- NUEVOS THUNKS --------------------
export const fetchEvent = createAsyncThunk<Event, { id: string }>(
    "events/fetchEvent",
    async ({ id }, { rejectWithValue }) => {
        try {
            const { data } = await apiEvent.get(`/api/event/${id}`);
            const ev = data?.event ?? {};
            const funcs = Array.isArray(data?.functions) ? data.functions : [];
            const zones = Array.isArray(data?.zones) ? data.zones : [];

            const mapped: Event = {
                id: String(ev.id ?? ev.eventId ?? id),
                name: String(ev.name ?? ""),
                description: String(ev.description ?? ""),
                state: normalizeState(ev.status ?? ev.state ?? "Creado"),
                image: "/images/event-placeholder.png",
                zones: zones.map((z: any): Zone => ({
                    id: String(z.id ?? z.zoneId ?? ""),
                    name: String(z.name ?? ""),
                    price: Number(z.price ?? 0),
                })),
                functions: funcs.map((f: any): EventFunction => ({
                    name: String(f.name ?? ""),
                    description: String(f.description ?? ""),
                    startDate: String(f.startDate ?? ""),
                    endDate: String(f.endDate ?? ""),
                    // venueId viene en la función; si necesitas detalles, podrías enriquecer luego
                    venue: {
                        name: "",
                        capacity: 0,
                        address: "",
                        location: { country: "", city: "" },
                    },
                })),
            };

            return mapped;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data ?? err?.message ?? "Error al cargar evento");
        }
    }
);

export const fetchEventFunctions = createAsyncThunk<EventFunction[], { eventId: string }>(
    "events/fetchEventFunctions",
    async ({ eventId }, { rejectWithValue }) => {
        try {
            if (process.env.NEXT_PUBLIC_USE_MOCKS === "true") {
                const ev = mockEvents.find((e) => e.id === eventId);
                return ev?.functions ?? [];
            }
            const { data } = await apiEvent.get(`/events/${eventId}/functions`);
            const list = Array.isArray(data) ? data : [];
            return list.map((f: any): EventFunction => ({
                name: String(f.name ?? ""),
                description: String(f.description ?? ""),
                startDate: String(f.startDate ?? f.fechaInicio ?? f.start_date ?? new Date().toISOString()),
                endDate: String(f.endDate ?? f.fechaFin ?? f.end_date ?? new Date().toISOString()),
                venue: {
                    name: String(f.venue?.name ?? f.lugar?.name ?? ""),
                    capacity: Number(f.venue?.capacity ?? f.lugar?.capacity ?? 0),
                    address: String(f.venue?.address ?? f.lugar?.direccion ?? ""),
                    location: {
                        country: String(
                            f.venue?.location?.country ??
                            f.lugar?.ubicacionGeografica?.pais ??
                            f.lugar?.location?.country ?? ""
                        ),
                        city: String(
                            f.venue?.location?.city ??
                            f.lugar?.ubicacionGeografica?.ciudad ??
                            f.lugar?.location?.city ?? ""
                        ),
                    },
                },
            }));
        } catch (err: any) {
            return rejectWithValue(err?.message ?? "Error al cargar funciones");
        }
    }
);

export const createEvent = createAsyncThunk<Event, { event: Partial<Event> }>(
    "events/createEvent",
    async ({ event }, { rejectWithValue }) => {
        try {
            if (process.env.NEXT_PUBLIC_USE_MOCKS === "true") {
                const mockCreado: Event = {
                    id: crypto.randomUUID?.() ?? `${Date.now()}`,
                    name: event.name ?? "",
                    description: event.description ?? "",
                    state: normalizeState(event.state ?? "Creado"),
                    image: event.image ?? "/images/event-placeholder.png",
                    zones: event.zones ?? [],
                    functions: event.functions ?? [],
                };
                return mockCreado;
            }
            const { userId } = getAuthData();
            const payload = { ...event, userId };
            const { data } = await apiEvent.post("/events", payload);
            return normalizeEvent(data);
        } catch (err: any) {
            return rejectWithValue(err?.message ?? "Error al crear evento");
        }
    }
);

export const updateEvent = createAsyncThunk<Event, { id: string; event: Partial<Event> }>(
    "events/updateEvent",
    async ({ id, event }, { rejectWithValue }) => {
        try {
            if (process.env.NEXT_PUBLIC_USE_MOCKS === "true") {
                const updated: Event = {
                    id,
                    name: event.name ?? "Actualizado",
                    description: event.description ?? "",
                    state: normalizeState(event.state ?? "AVAILABLE"),
                    image: event.image ?? "/images/event-placeholder.png",
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
            return rejectWithValue(err?.message ?? "Error al actualizar evento");
        }
    }
);



export const fetchCountries = createAsyncThunk<Country[]>(
    "events/fetchCountries",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await apiEvent.get("/api/location");
            const list = Array.isArray(data) ? data : [];

            // Solo países: type === 0
            const countriesOnly = list.filter((loc: any) => Number(loc?.type) === 0);

            return countriesOnly.map((loc: any) => ({
                code: String(loc.locationId ?? loc.id ?? ""),
                name: String(loc.name ?? loc.country ?? ""),
                cities: Array.isArray(loc.cities)
                    ? loc.cities.map((c: any) => String(c?.name ?? c))
                    : [],
            }));
        } catch (err: any) {
            return rejectWithValue(err?.response?.data ?? err?.message ?? "Error al cargar países");
        }
    }
);

export const fetchCities = createAsyncThunk<string[], { countryCode: string }>(
    "events/fetchCities",
    async ({ countryCode }, { rejectWithValue }) => {
        try {
            // Usa el endpoint correcto: /api/location/{id}/cities
            const { data } = await apiEvent.get(`/api/location/${countryCode}/cities`);
            const list = Array.isArray(data) ? data : (Array.isArray(data?.cities) ? data.cities : []);
            return list.map((c: any) => String(c?.name ?? c));
        } catch (err: any) {
            return rejectWithValue(err?.response?.data ?? err?.message ?? "Error al cargar ciudades");
        }
    }
);

export const fetchVenues = createAsyncThunk<Venue[]>(
    "events/fetchVenues",
    async (_, { rejectWithValue }) => {
        try {
            // Siempre BD
            const { data } = await apiEvent.get("/api/venue");
            const list = Array.isArray(data) ? data : [];
            return list.map((v: any) => ({
                id: String(v.venueId ?? v.id ?? ""),
                name: String(v.name ?? ""),
                capacity: Number(v.capacity ?? 0),
                address: String(v.address ?? ""),
                location: {
                    country: String(v.location?.country ?? ""),
                    city: String(v.location?.city ?? "")
                }
            }));
        } catch (err: any) {
            return rejectWithValue(err?.message ?? "Error al cargar venues");
        }
    }
);

// Crear evento completo (POST /api/event/create-full)
export const createEventFull = createAsyncThunk<any, { payload: any }>(
    "events/createEventFull",
    async ({ payload }, { rejectWithValue }) => {
        try {
            const { data } = await apiEvent.post("/api/event/create-full", payload);
            return data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data ?? err?.message ?? "Error al crear evento");
        }
    }
);

export const createVenue = createAsyncThunk<Venue, {
    name: string;
    capacity: number;
    address: string;
    locationId: string;
}>(
    "events/createVenue",
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await apiEvent.post("/api/venue", payload);
            const v = data ?? {};
            return {
                id: String(v.venueId ?? v.id ?? ""),
                name: String(v.name ?? payload.name),
                capacity: Number(v.capacity ?? payload.capacity ?? 0),
                address: String(v.address ?? payload.address ?? ""),
                location: {
                    country: String(v.location?.country ?? ""),
                    city: String(v.location?.city ?? ""),
                },
            };
        } catch (err: any) {
            return rejectWithValue(err?.response?.data ?? err?.message ?? "Error al crear venue");
        }
    }
);

export const updateVenue = createAsyncThunk<Venue, {
    id: string;
    name: string;
    capacity: number;
    address: string;
    locationId: string;
}>(
    "events/updateVenue",
    async ({ id, ...payload }, { rejectWithValue }) => {
        try {
            const { data } = await apiEvent.put(`/api/venue/${id}`, payload);
            const v = data ?? {};
            return {
                id: String(v.venueId ?? v.id ?? id),
                name: String(v.name ?? payload.name),
                capacity: Number(v.capacity ?? payload.capacity ?? 0),
                address: String(v.address ?? payload.address ?? ""),
                location: {
                    country: String(v.location?.country ?? ""),
                    city: String(v.location?.city ?? ""),
                },
            };
        } catch (err: any) {
            return rejectWithValue(err?.response?.data ?? err?.message ?? "Error al actualizar venue");
        }
    }
);

// -------------------- SLICE --------------------
const eventsSlice = createSlice({
    name: "events",
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
    extraReducers: (b) => {
        b
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
                state.error = (action.payload as string) ?? action.error.message ?? "Error al cargar eventos";
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
                state.error = (action.payload as string) ?? action.error.message ?? "Error al cargar evento";
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
                state.error = (action.payload as string) ?? action.error.message ?? "Error al cargar funciones";
            })

            // Crear
            .addCase(createEvent.fulfilled, (state, action) => {
                state.events.push(action.payload);
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.error = (action.payload as string) ?? action.error.message ?? "Error al crear evento";
            })

            // Actualizar
            .addCase(updateEvent.fulfilled, (state, action) => {
                state.events = state.events.map((ev) => (ev.id === action.payload.id ? action.payload : ev));
                if (state.selectedEvent?.id === action.payload.id) {
                    state.selectedEvent = action.payload;
                }
            })
            .addCase(updateEvent.rejected, (state, action) => {
                state.error = (action.payload as string) ?? action.error.message ?? "Error al actualizar evento";
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
                state.error = (action.payload as string) ?? action.error.message ?? "Error al cargar países";
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
                state.error = (action.payload as string) ?? action.error.message ?? "Error al cargar ciudades";
            })
            .addCase(fetchVenues.pending, (state) => {
                state.loadingVenues = true;
            })
            .addCase(fetchVenues.fulfilled, (state, action: PayloadAction<Venue[]>) => {
                state.loadingVenues = false;
                // garantiza ids si faltan (BACKUP)
                state.venues = action.payload.map((v, i) => ({
                    ...v,
                    id: v.id ?? `venue-${i + 1}`,
                }));
            })
            .addCase(fetchVenues.rejected, (state, action) => {
                state.loadingVenues = false;
                state.error = (action.payload as string) ?? action.error.message ?? "Error al cargar venues";
            })
            // Opcional: manejar estados de createEventFull
            .addCase(createEventFull.pending, (s) => {
                s.loadingEvent = true;
            })
            .addCase(createEventFull.fulfilled, (s) => {
                s.loadingEvent = false;
            })
            .addCase(createEventFull.rejected, (s) => {
                s.loadingEvent = false;
            })
            .addCase(createVenue.pending, (s) => { s.loadingVenues = true; })
            .addCase(createVenue.fulfilled, (s, a) => {
                s.loadingVenues = false;
                s.venues = [a.payload, ...s.venues];
            })
            .addCase(createVenue.rejected, (s, a) => {
                s.loadingVenues = false;
                s.error = (a.payload as string) ?? a.error.message ?? "Error al crear venue";
            })
            .addCase(updateVenue.pending, (s) => { s.loadingVenues = true; })
            .addCase(updateVenue.fulfilled, (s, a) => {
                s.loadingVenues = false;
                s.venues = s.venues.map(v => v.id === a.payload.id ? a.payload : v);
            })
            .addCase(updateVenue.rejected, (s, a) => {
                s.loadingVenues = false;
                s.error = (a.payload as string) ?? a.error.message ?? "Error al actualizar venue";
            });
    },
});

export default eventsSlice.reducer;
export { fetchVenues, fetchCountries, fetchCities, createVenue, updateVenue };
