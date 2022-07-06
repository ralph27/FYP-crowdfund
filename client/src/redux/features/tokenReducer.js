const initialState = null;

export default function tokenReducer(state = initialState, action) {
   let temp;
   switch (action.type) {
      case "token/setInfo":
         temp = { ...state };
         temp.ethReserve = action.token.ethReserve;
         temp.gmsReserve = action.token.gmsReserve;
         temp.supply = action.token.supply
         return temp;
      case "token/reserves": 
         temp = {...state};
         temp.ReserveGMS = action.reserves.GMS;
         temp.ReserveETH = action.reserves.ETH;
         return temp;
      default:
         return state;

   }
}