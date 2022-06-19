const initialState = null;

export default function stakingReducer(state = initialState, action) {
   let temp;
   switch (action.type) {
      case "staking/updateStaking":
         console.log('action', action.stake);
        return action.stake;
      case "staking/addStaking":
         return [
            ...state,
            action.stake
         ]
      case "staking/removeStaking":
         console.log("ID ", action?.id.id);
         const filtered = state.filter(stake => stake.id !== action.id.id);
         console.log("FILTERED", filtered);
         return filtered;
      default:
         return state;

   }
}