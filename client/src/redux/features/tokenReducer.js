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
      default:
         return state;

   }
}