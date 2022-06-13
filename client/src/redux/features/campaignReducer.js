const initialState = null;

export default function campaignReducer(state = initialState, action) {
   let temp;
   switch(action.type) {

      case "campaign/setDetails":
         temp = { ...state };
         temp.currentCampaign = action.campaign;
         return temp;
      case "campaign/invest":
         temp = { ...state.currentCampaign };
         temp.pledged = action.campaign.pledged
         temp.nbOfInvestors = action.campaign.nbOfInvestors
         return {
            ...state,
            currentCampaign: temp
         };
      default:
         return state;

   }
}