import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'



export const getProduct = createAsyncThunk('product/getProduct', async({keyword,page=1},{rejectWithValue})=>{
    // to handle errors
    try{
        const link = keyword?`/api/products?keyword=${encodeURIComponent(keyword)}&page=${page}`:`/api/products?page=${page}`
        // Access API link[backend]
        // const link = '/api/products';
        // get request
        const {data} = await axios.get(link);
        console.log('Response:',data);

        return data;


    }catch(err){
        return rejectWithValue(err.response?.data || 'Some error occurred');
        // from backend error
    }
})

// product details
export const getProductDetails = createAsyncThunk('product/getProductDetails', async(id,{rejectWithValue})=>{
    try{
        const link=`/api/product/${id}`
        const {data} = await axios.get(link);
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || 'Some error occurred');
    }
})
const productSlice = createSlice({
    name:'product',
    initialState: {
        products: [],
        productCount: 0,
        loading:false,
        error:null,
        product:null,
        resultsPerPage:4,
        totalPages:0
    },
    reducers:{
        removeErrors:(state)=>{
            state.error = null;
        },
        // while working with APIs the errors if any should be shown to user and to be removed after some time.
    },
    // lifecycle actions
    extraReducers:(builder)=>{
        builder.addCase(getProduct.pending, (state)=>{
            state.loading=true
            state.error = null
            // load spinners in UI
        })
        .addCase(getProduct.fulfilled,(state,action)=>{
            console.log('Fulfilled action payload', action.payload)
            state.loading = false;
            state.error =null;
            state.products = action.payload.products; //from backend
            state.productCount = action.payload.productCount;
            state.resultsPerPage = action.payload.resultsPerPage;
            state.totalPages = action.payload.totalPages;

        })
        .addCase(getProduct.rejected, (state,action)=>{
            state.loading=false;
            state.error = action.payload || 'Something went wrong';
            state.products=[];
        })

        builder.addCase(getProductDetails.pending, (state)=>{
            state.loading=true;
            state.error=null
        })
        .addCase(getProductDetails.fulfilled,(state,action)=>{
            console.log('Product details', action.payload)
            state.loading = false;
            state.error =null;
            state.product = action.payload.product; //from backend
        })
        .addCase(getProductDetails.rejected, (state,action)=>{
            state.loading=false;
            state.error = action.payload || 'Something went wrong';
        })

    }

})

export const {removeErrors} = productSlice.actions;
// removeErros -> action creator
export default productSlice.reducer;

// reducers defind how the state changes when an action is dispatched...

