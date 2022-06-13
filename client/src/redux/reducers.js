import { combineReducers } from "redux";
import fetchReducer from "./features/fetchReducer";
import tokenReducer from "./features/tokenReducer";
import TransactionReducer from "./features/TransactionReducer";
import userReducer from "./features/userReducer";
import campaignReducer from "./features/campaignReducer";


const rootReducer = combineReducers({
   user: userReducer,
   campaign: campaignReducer,
   token: tokenReducer,
   fetch: fetchReducer,
   transaction: TransactionReducer

})

export default rootReducer;