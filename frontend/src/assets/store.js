import { configureStore } from '@reduxjs/toolkit'
import { counterSlice } from './Storecontext'

export default configureStore({
    reducer: {
        counter: counterSlice
    }
})