const initialState = null;

export default function fetchReducer(state = initialState, action) {
   let temp;
   switch (action.type) {
      case "fetch/setFetch":
         temp = { ...state };
         temp = action.status;
         return temp;
      default:
         return state;

   }
}