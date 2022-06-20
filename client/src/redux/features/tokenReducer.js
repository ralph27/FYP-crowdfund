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
         console.log("ACTION: ", action.staked);
         temp = {...state};

         temp.staked = Number(temp.staked) + action.staked;
         console.log("TEMP: ", temp);
         return temp;
      default:
         return state;

   }
}