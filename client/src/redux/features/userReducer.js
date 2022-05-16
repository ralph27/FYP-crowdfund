const initialState = null;

export default function userReducer(state = initialState, action) {
   let temp;
   switch (action.type) {
      case "user/login":
         temp = { ...state };
         temp.wallet = action.wallet;
         return temp;
      case "user/setBalance":
         temp = { ...state };
         temp.balance = action.balance;
         return temp;
      default:
         return state;

   }
}