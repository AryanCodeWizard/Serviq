import {createSlice} from '@reduxjs/toolkit'


const initialState = {
    token:null,
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        setToken: (state,value) =>{
            state.token=value.payload;
        },
        clearAuth: (state) => {
            state.token = null;
        }
    }
})
export const {setToken, clearAuth} = authSlice.actions;
export default authSlice.reducer;