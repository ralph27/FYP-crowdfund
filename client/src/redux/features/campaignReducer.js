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
         console.log('state', state);
         console.log('temp before', temp);
         temp.pledged = action.campaign.pledged
         temp.nbOfInvestors = action.campaign.nbOfInvestors
         console.log('temp after', temp);
         return {
            ...state,
            currentCampaign: temp
         };
      default:
         return state;

   }
}