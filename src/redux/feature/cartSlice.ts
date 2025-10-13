
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../config/axios';

// Define the CartItem type if not already defined
interface Product {
  id: string;
  productName: string;
  price: number;
  productImage: string;
  quantity: number;
  category: string;
  condition: string;
  seller: string;
  location: string;
}

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  isChecked?: boolean;
  addedAt?: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: []
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'addedAt'>>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ 
          ...action.payload, 
          addedAt: new Date().toISOString() 
        });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    }
  },
});

export const { 
  setItems,
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart 
} = cartSlice.actions;

export default cartSlice.reducer;

// Selector to get total number of items in cart (counting quantities)
export const selectCartItemsCount = (state: { cart: CartState }) => {
  return state.cart.items.reduce((total, item) => total + item.quantity, 0);
};

// Selector to get all items in cart

export const selectCartItems = (state: { cart: CartState }) => {
  return state.cart.items;
};

// Selector to get total price of all items in cart
export const selectCartTotal = (state: { cart: CartState }) => {
  return state.cart.items.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
};

// Selector to get a specific cart item by id
export const selectCartItemById = (state: { cart: CartState }, id: string) => {
  return state.cart.items.find(item => item.id === id);
};

// Selector to get only checked items (for checkout)
export const selectCheckedCartItems = (state: { cart: CartState }) => {
  return state.cart.items.filter(item => item.isChecked);
};

// Selector to get total price of checked items
export const selectCheckedCartTotal = (state: { cart: CartState }) => {
  return state.cart.items
    .filter(item => item.isChecked)
    .reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
};