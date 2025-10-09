import { combineReducers } from '@reduxjs/toolkit'
import userReducer from './feature/userSlice'
import cartReducer from './feature/cartSlice'

export const rootReducer = combineReducers ({
    user: userReducer,
    cart: cartReducer,
})