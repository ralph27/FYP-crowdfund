const initialState = null;

export default function userReducer(state = initialState, action) {
   let temp;
   switch (action.type) {
      case "user/login":
         temp = { ...state };
         temp.wallet = action.wallet.address;
         temp.balance = action.wallet.balance
         return temp;
      default:
         return state;

   }
}