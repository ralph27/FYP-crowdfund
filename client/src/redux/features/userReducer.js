const initialState = null;

export default function userReducer(state = initialState, action) {
   let temp;
   switch (action.type) {
      case "user/login":
         temp = { ...state };
         temp.wallet = action.wallet.address;
         temp.balance = action.wallet.balance;
         temp.ethBalance = action.wallet.ethBal;
         temp.shares = action.wallet.shares;
         return temp;
      case "user/updateBalance": 
         temp = { ...state };
         temp[action.wallet.balanceType] -= action.wallet.value;
         console.log(temp);
         return temp;
      case "user/updateProfile":
         temp = { ...state };
         temp.amountInvested = action.profile.invested;
         temp.amountRaised = action.profile.amountRaised;
         return temp;
      default:
         return state;

   }
}