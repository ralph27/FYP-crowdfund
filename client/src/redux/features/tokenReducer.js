const initialState = null;

export default function tokenReducer(state = initialState, action) {
   let temp;
   switch (action.type) {
      case "token/setInfo":
         temp = { ...state };
         temp.supply = action.token.supply;
         temp.circulation = action.token.circulation;
         temp.staked = action.token.staked
         return temp;
      case "token/updateStaked":
         temp = {...state};
         temp.staked = Number(temp.staked) + action.staked;
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