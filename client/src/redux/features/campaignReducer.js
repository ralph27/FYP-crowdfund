const initialState = null;

export default function campaignReducer(state = initialState, action) {
   let temp;
   switch(action.type) {

      case "campaign/setDetails":
         temp = { ...state };
         temp.currentCampaign = action.campaign;
         return temp;
      default:
         return state;

   }
}