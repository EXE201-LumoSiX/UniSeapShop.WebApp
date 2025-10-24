
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/axios';

// Async thunk to fetch cart items
export const fetchCartItems = createAsyncThunk(
  'cart/fetchItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/cart');
      
      if (response.data && response.data.isSuccess) {
        const cartData = response.data.value?.data || {};
        
        // Transform API response to match our CartItem structure
        const items = cartData.items?.map((item: any) => ({
          id: item.productId,
          product: {
            id: item.productId,
            productName: item.productName,
            price: item.price,
            productImage: item.productImage || '',
            quantity: item.productQuantity || 10, // Available stock
            category: item.categoryName || 'Uncategorized',
            condition: item.usageHistory || 'Used',
            seller: item.supplierName || 'Unknown',
            location: 'Việt Nam'
          },
          quantity: item.quantity, // Cart quantity
          addedAt: new Date().toISOString(),
          isChecked: item.isCheck || false
        })) || [];
        
        return {
          items,
          totalPrice: cartData.totalPrice || 0
        };
      } else {
        return rejectWithValue(response.data?.error || 'Failed to fetch cart items');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Could not fetch cart items'
      );
    }
  }
);