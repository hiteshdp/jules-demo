import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI } from '../api/productAPI';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  image?: string;
  is_active: boolean;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (_: void, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
    try {
      const response = await productAPI.getProducts();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (productData: any, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
    try {
      const response = await productAPI.createProduct(productData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
    try {
      const response = await productAPI.updateProduct(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (id: number, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
    try {
      await productAPI.deleteProduct(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearError: (state: any) => {
      state.error = null;
    },
  },
  extraReducers: (builder: any) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state: any, action: any) => {
        state.loading = false;
        // Handle both paginated and non-paginated responses
        const responseData = action.payload?.data || action.payload;
        state.products = Array.isArray(responseData) ? responseData : (responseData?.data || []);
      })
      .addCase(fetchProducts.rejected, (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Product
      .addCase(createProduct.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.products.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Product
      .addCase(updateProduct.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state: any, action: any) => {
        state.loading = false;
        const index = state.products.findIndex((product: any) => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.products = state.products.filter((product: any) => product.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state: any, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;
