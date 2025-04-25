import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    allProducts: [],  
    filteredProducts: [], 
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
            if (searchQuery?.length >= 2) {

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
        sortProducts: (state, action) => {
            const sortType = action.payload;
            console.log(sortType,'sortType')
            switch (sortType) {
                case 'low-to-high':
                    state.filteredProducts = [...state.filteredProducts].sort((a, b) => a.price - b.price);
                    break;
                case 'high-to-low':
                    state.filteredProducts = [...state.filteredProducts].sort((a, b) => b.price - a.price);
                    break;
                case 'oldest-to-newest':
                    state.filteredProducts = [...state.filteredProducts].sort((a, b) => new Date(a.biddingStartTime) - new Date(b.biddingStartTime));
                    break;
                case 'newest-to-oldest':
                    state.filteredProducts = [...state.filteredProducts].sort((a, b) => new Date(b.biddingStartTime) - new Date(a.biddingStartTime));
                    break;
                default:
                    break;
            }
        }
    },
});

export const { setAllProducts,sortProducts, filterBySearch, setFilteredProducts, filterBySubCategory, filterByCategory, clearFilteredProducts } = filterSlice.actions;
export default filterSlice.reducer;
