import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiUser } from "../../axios";

export interface User {
    id?: string;
    userId?: string;
    userName: string;
    userLastName: string;
    userEmail: string;
    userPhoneNumber: string;
    userDirection: string;
    userType: string;
    userPassword?: string;
}

interface UserState {
    users: User[];
    currentUser: User | null;
    loading: boolean;
    error: string | null;
    creating: boolean;
    createError: string | null;
    resetting?: boolean;
    resetError?: string | null;
}

const initialState: UserState = {
    users: [],
    currentUser: null,
    loading: false,
    error: null,
    creating: false,
    createError: null,
    resetting: false,
    resetError: null,
};

// GET: lista de usuarios (ajusta ruta si tu API expone /users)
export const fetchUsers = createAsyncThunk<User[]>(
    "user/fetchUsers",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await apiUser.get("/users/GetAllUsers");
            const arr = Array.isArray(data) ? data : [];
            // Normaliza campos si tu API usa otros nombres
            return arr.map((u: any) => ({
                id: String(u.id ?? u.userId ?? ""),
                userName: String(u.userName ?? u.name ?? ""),
                userLastName: String(u.userLastName ?? u.lastName ?? ""),
                userEmail: String(u.userEmail ?? u.email ?? ""),
                userPhoneNumber: String(u.userPhoneNumber ?? u.phone ?? ""),
                userDirection: String(u.userDirection ?? u.address ?? ""),
                userType: String(u.userType ?? u.type ?? ""),
            }));
        } catch (err: any) {
            return rejectWithValue(err?.message ?? "Error al cargar usuarios");
        }
    }
);

// POST: crear usuario (usa el endpoint de tu imagen /users/CreateUser)
export const createUser = createAsyncThunk<User, User>(
    "user/createUser",
    async (user, { rejectWithValue }) => {
        try {
            const payload = {
                userName: user.userName,
                userLastName: user.userLastName,
                userEmail: user.userEmail,
                userPhoneNumber: user.userPhoneNumber,
                userDirection: user.userDirection,
                userType: user.userType,
                userPassword: user.userPassword,
            };
            const { data } = await apiUser.post("/users/CreateUser", payload);
            return {
                id: String(data?.id ?? data?.userId ?? ""),
                userName: String(data?.userName ?? payload.userName),
                userLastName: String(data?.userLastName ?? payload.userLastName),
                userEmail: String(data?.userEmail ?? payload.userEmail),
                userPhoneNumber: String(data?.userPhoneNumber ?? payload.userPhoneNumber),
                userDirection: String(data?.userDirection ?? payload.userDirection),
                userType: String(data?.userType ?? payload.userType),
            };
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.message ?? err?.message ?? "Error al crear usuario");
        }
    }
);

// GET: un solo usuario por ID (ajusta ruta y método si es necesario)
export const fetchUserById = createAsyncThunk<User, string>(
    "user/fetchUserById",
    async (userId, { rejectWithValue }) => {
        try {
            const { data } = await apiUser.get("/users/GetUserById", { params: { usersId: userId } });
            const u = data ?? {};
            return {
                id: String(u.id ?? u.userId ?? userId),
                userId: String(u.userId ?? u.id ?? userId),
                userName: u.userName ?? "",
                userLastName: u.userLastName ?? "",
                userEmail: u.userEmail ?? "",
                userPhoneNumber: u.userPhoneNumber ?? "",
                userDirection: u.userDirection ?? "",
                userType: u.userType ?? "",
            } as User;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.message ?? err?.message ?? "Error al cargar usuario");
        }
    }
);

// PATCH: actualizar usuario (usa el endpoint de tu imagen /users/UpdateUser)
export const updateUser = createAsyncThunk<User, { userId: string; user: User }>(
    "user/updateUser",
    async ({ userId, user }, { rejectWithValue }) => {
        try {
            const payload = {
                userId: userId,
                userName: user.userName,
                userLastName: user.userLastName,
                userEmail: user.userEmail,
                userPhoneNumber: user.userPhoneNumber,
                userDirection: user.userDirection,
                userPassword: user.userPassword ?? "", // si tu API requiere este campo, envía vacío si no cambia
                userType: user.userType,
            };
            const { data } = await apiUser.put("/users/UpdateUser", payload);
            return {
                id: String(data?.id ?? data?.userId ?? userId),
                userName: String(data?.userName ?? payload.userName),
                userLastName: String(data?.userLastName ?? payload.userLastName),
                userEmail: String(data?.userEmail ?? payload.userEmail),
                userPhoneNumber: String(data?.userPhoneNumber ?? payload.userPhoneNumber),
                userDirection: String(data?.userDirection ?? payload.userDirection),
                userType: String(data?.userType ?? payload.userType),
            };
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.message ?? err?.message ?? "Error al actualizar usuario");
        }
    }
);

// POST: recuperar contraseña (nuevo thunk)
export const forgotPassword = createAsyncThunk<void, string>(
    "user/forgotPassword",
    async (email, { rejectWithValue }) => {
        try {
            await apiUser.post("/users/ForgotPassword", { userEmail: email });
            return;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data?.message ?? err?.message ?? "Error al solicitar recuperación");
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setCurrentUser(state, action: PayloadAction<User | null>) {
            state.currentUser = action.payload;
        },
        clearUserError(state) {
            state.error = null;
            state.createError = null;
        },
    },
    extraReducers: (builder) => {
        // fetchUsers
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = String(action.payload ?? action.error.message ?? "Error");
            });

        // createUser
        builder
            .addCase(createUser.pending, (state) => {
                state.creating = true;
                state.createError = null;
            })
            .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.creating = false;
                // agrega el nuevo usuario a la lista
                state.users = [action.payload, ...state.users];
            })
            .addCase(createUser.rejected, (state, action) => {
                state.creating = false;
                state.createError = String(action.payload ?? action.error.message ?? "Error");
            });

        // fetchUserById
        builder
            .addCase(fetchUserById.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = String(action.payload ?? action.error.message ?? "Error");
            });

        // updateUser
        builder
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.currentUser = action.payload;
                const idx = state.users.findIndex(u =>
                    String(u.id ?? u.userId) === String(action.payload.id ?? action.payload.userEmail)
                );
                if (idx >= 0) state.users[idx] = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = String(action.payload ?? action.error.message ?? "Error");
            });

        // forgotPassword
        builder
            .addCase(forgotPassword.pending, (state) => {
                state.resetting = true;
                state.resetError = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.resetting = false;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.resetting = false;
                state.resetError = String(action.payload ?? action.error.message ?? "Error");
            });
    },
});

export const { setCurrentUser, clearUserError } = userSlice.actions;
export default userSlice.reducer;