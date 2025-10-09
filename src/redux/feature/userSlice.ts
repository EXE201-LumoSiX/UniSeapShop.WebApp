import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Định nghĩa interface cho User
interface User {
    id?: string;
    email?: string;
    fullName?: string;
    phoneNumber?: string;
    avatar?: string;
    role?: string;
    // Thêm các thuộc tính khác nếu cần
}

// Định nghĩa interface cho Login Response
interface LoginResponse {
    token: string;
    tokenExpiration: string;
    user: User;
}

// Định nghĩa type cho state
type UserState = LoginResponse | null;

const userSlice = createSlice({
    name: "user",
    initialState: null as UserState,
    reducers: {
        login: (state, action: PayloadAction<LoginResponse>) => {
            return action.payload;
        },

        logout: () => {
            // Xóa dữ liệu từ localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("tokenExpiration");
            localStorage.removeItem("role");
            localStorage.removeItem("user");
            return null;
        },

        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state) {
                return {
                    ...state,
                    user: {
                        ...state.user,
                        ...action.payload,
                    }
                };
            }
            return state;
        }
    }
});

export const { login, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;