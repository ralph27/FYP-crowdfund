const initialState = null;

export default function TransactionReducer(state = initialState, action) {
   let temp;
   switch (action.type) {
      case "tx/setTx":
         temp = { ...state };
         temp.tx = action.tx;
         temp.pending = true;
         return temp;
      case "tx/setStatus":
         temp = {...state};
         temp.status = action.status;
         temp.pending = false;
         return temp;
      default:
         return state;

   }
}