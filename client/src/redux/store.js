import { configureStore } from "@reduxjs/toolkit";
import campaignReducer from "./features/campaignReducer";
import tokenReducer from "./features/tokenReducer";
import userReducer from "./features/userReducer";

export const store = configureStore({
   reducer: {
      user: userReducer,
      campaign: campaignReducer,
      token: tokenReducer
   }
})