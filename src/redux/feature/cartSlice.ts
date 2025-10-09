import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  id: string;
  productName: string;
  productImage: string;
  price: number;
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
  addedAt: string;
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
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// Selector to get total number of items in cart (counting quantities)
export const selectCartItemsCount = (state: { cart: CartState }) => {
  return state.cart?.items ? state.cart.items.reduce((total, item) => total + item.quantity, 0) : 0;
};

// Selector to get all items in cart
export const selectCartItems = (state: { cart: CartState }) => state.cart?.items || [];

// Selector to get total price
export const selectCartTotal = (state: { cart: CartState }) => {
  return state.cart?.items 
    ? state.cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
    : 0;
};