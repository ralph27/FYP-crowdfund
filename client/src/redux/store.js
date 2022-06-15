// import { configureStore } from "@reduxjs/toolkit";
// import campaignReducer from "./features/campaignReducer";
// import fetchReducer from "./features/fetchReducer";
// import tokenReducer from "./features/tokenReducer";
// import TransactionReducer from "./features/TransactionReducer";
// import userReducer from "./features/userReducer";

// export const store = configureStore({
//    reducer: {
//       user: userReducer,
//       campaign: campaignReducer,
//       token: tokenReducer,
//       fetch: fetchReducer,
//       transaction: TransactionReducer
//    }
// })



import { createStore } from "redux";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import rootReducer from './reducers'; // the value from combineReducers

const persistConfig = {
 key: 'root',
 storage: storage,
 blacklist: ['campaign', 'transaction']
};

const pReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(pReducer);
export const persistor = persistStore(store);
