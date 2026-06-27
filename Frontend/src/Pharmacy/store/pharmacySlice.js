import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import pharmacyApi from "../api/pharmacyApi";

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const fetchMedicines = createAsyncThunk(
  "pharmacy/fetchMedicines",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await pharmacyApi.get("/medicines", { params });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch medicines");
    }
  }
);

export const fetchMedicineById = createAsyncThunk(
  "pharmacy/fetchMedicineById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await pharmacyApi.get(`/medicines/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch medicine");
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "pharmacy/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await pharmacyApi.get("/categories");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch categories");
    }
  }
);

export const fetchCart = createAsyncThunk(
  "pharmacy/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await pharmacyApi.get("/cart");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch cart");
    }
  }
);

export const addToCart = createAsyncThunk(
  "pharmacy/addToCart",
  async ({ medicineId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await pharmacyApi.post("/cart/items", null, { params: { medicineId, quantity } });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add to cart");
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "pharmacy/updateCartItem",
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await pharmacyApi.put(`/cart/items/${itemId}`, null, { params: { quantity } });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update cart");
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "pharmacy/removeCartItem",
  async (itemId, { rejectWithValue }) => {
    try {
      const { data } = await pharmacyApi.delete(`/cart/items/${itemId}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove item");
    }
  }
);

export const placeOrder = createAsyncThunk(
  "pharmacy/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await pharmacyApi.post("/orders", orderData);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to place order");
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  "pharmacy/fetchMyOrders",
  async ({ page = 0, size = 10 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await pharmacyApi.get("/orders", { params: { page, size } });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
    }
  }
);

export const uploadPrescription = createAsyncThunk(
  "pharmacy/uploadPrescription",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await pharmacyApi.post("/prescriptions/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to upload prescription");
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const pharmacySlice = createSlice({
  name: "pharmacy",
  initialState: {
    medicines: [],
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    selectedMedicine: null,
    categories: [],
    cart: null,
    orders: [],
    ordersPage: { totalPages: 0, totalElements: 0 },
    lastOrder: null,
    prescriptions: [],
    loading: false,
    cartLoading: false,
    orderLoading: false,
    error: null,
    filters: {
      search: "",
      categoryId: null,
      minPrice: null,
      maxPrice: null,
      sortBy: "name",
      sortDir: "asc",
    },
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError(state) {
      state.error = null;
    },
    clearLastOrder(state) {
      state.lastOrder = null;
    },
    // Called by the Socket.IO listener when a shipment:status event arrives
    updateOrderStatus(state, { payload: { orderId, status } }) {
      const order = state.orders.find((o) => o.id === orderId);
      if (order) order.status = status;
    },
  },
  extraReducers: (builder) => {
    // Medicines
    builder
      .addCase(fetchMedicines.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMedicines.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.medicines = payload.content;
        state.totalPages = payload.totalPages;
        state.totalElements = payload.totalElements;
        state.currentPage = payload.page;
      })
      .addCase(fetchMedicines.rejected, (state, { payload }) => {
        state.loading = false; state.error = payload;
      });

    // Single medicine
    builder
      .addCase(fetchMedicineById.pending, (state) => { state.loading = true; })
      .addCase(fetchMedicineById.fulfilled, (state, { payload }) => {
        state.loading = false; state.selectedMedicine = payload;
      })
      .addCase(fetchMedicineById.rejected, (state, { payload }) => {
        state.loading = false; state.error = payload;
      });

    // Categories
    builder
      .addCase(fetchCategories.fulfilled, (state, { payload }) => {
        state.categories = payload;
      });

    // Cart
    const cartCases = [fetchCart, addToCart, updateCartItem, removeCartItem];
    cartCases.forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => { state.cartLoading = true; })
        .addCase(thunk.fulfilled, (state, { payload }) => {
          state.cartLoading = false; state.cart = payload;
        })
        .addCase(thunk.rejected, (state, { payload }) => {
          state.cartLoading = false; state.error = payload;
        });
    });

    // Orders
    builder
      .addCase(placeOrder.pending, (state) => { state.orderLoading = true; })
      .addCase(placeOrder.fulfilled, (state, { payload }) => {
        state.orderLoading = false;
        state.lastOrder = payload;
        state.cart = null;
      })
      .addCase(placeOrder.rejected, (state, { payload }) => {
        state.orderLoading = false; state.error = payload;
      });

    builder
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.orders = payload.content;
        state.ordersPage = { totalPages: payload.totalPages, totalElements: payload.totalElements };
      })
      .addCase(fetchMyOrders.rejected, (state, { payload }) => {
        state.loading = false; state.error = payload;
      });

    // Prescription
    builder
      .addCase(uploadPrescription.fulfilled, (state, { payload }) => {
        state.prescriptions.unshift(payload);
      });
  },
});

export const { setFilters, clearError, clearLastOrder, updateOrderStatus } = pharmacySlice.actions;
export default pharmacySlice.reducer;
