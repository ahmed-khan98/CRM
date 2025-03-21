import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    allProducts: [],  // Store all products initially
    filteredProducts: [], // Store filtered products
};

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setAllProducts: (state, action) => {
            state.allProducts = action.payload;
            state.filteredProducts = action.payload; 
          },
        filterByCategory: (state, action) => {
            const categoryId = action.payload;
            if (categoryId) {

                state.filteredProducts = state.allProducts.filter(
                    (product) => product.category === categoryId
                );
            }
        },
        filterBySubCategory: (state, action) => {
            const subcategoryId = action.payload;
            if (subcategoryId) {

                state.filteredProducts = state.allProducts.filter(
                    (product) => product.subcategory === subcategoryId
                );
            }
        },
        filterBySearch: (state, action) => {
            const searchQuery = action.payload.toLowerCase();
            if (searchQuery?.length > 2) {

                state.filteredProducts = state.allProducts.filter((product) =>
                    product.name.toLowerCase().includes(searchQuery)
                );
            }
            else{
                state.filteredProducts = state.allProducts;  
            }
        },
        clearFilteredProducts: (state) => {
            state.filteredProducts = state.allProducts;
        },
    },
});

export const { setAllProducts, filterBySearch, setFilteredProducts, filterBySubCategory, filterByCategory, clearFilteredProducts } = filterSlice.actions;
export default filterSlice.reducer;
