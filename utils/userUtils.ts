import { REFFERED_USER, REFFERER, SIGNUP } from "@/config/points";
import User, { UserTable } from "../model/User";
import { getManagementApiToken, getUserDetails } from "./userDetails";
import Transactions from "../model/Transactions";
import { TransactionType } from "../model/enum/TransactionType";

export async function createAuth0user(session:any){
    const accessToken = await getManagementApiToken();
    const userDetails = await getUserDetails(session.user.sub, accessToken);
      const existingUser = await User.findOne({ email: userDetails.email });
      if (existingUser) {
        throw Error('User already exists');
      }

      const referralCodeGenerated: string = Math.random().toString(36).substring(7);
      let referrer: UserTable | null = null;
      if (userDetails.user_metadata.referral_code) {
        referrer = await User.findOne({ referralCode: userDetails.user_metadata.referral_code });
      }

      const newUser = new User({
        firstName: userDetails.user_metadata.given_name,
        lastName: userDetails.user_metadata.family_name,
        email: userDetails.email,
        referralCode: referralCodeGenerated,
        profileImg:userDetails.picture,
        referredBy: referrer ? referrer._id : null,
        createdAt: new Date(),
        gfxCoin: SIGNUP
      });

      const newTransaction = new Transactions({
        email: userDetails.email,
        gfxCoin: SIGNUP,  
        transactionType: TransactionType.RECEIVED_FROM_SIGNUP  
      });
      await newTransaction.save();

      if (referrer) {
        referrer.referredUsers.push(newUser._id);
        referrer.gfxCoin += REFFERER;
        await referrer.save();
        const newTransaction = new Transactions({
          email: referrer.email,
          gfxCoin: REFFERER,  
          transactionType: TransactionType.RECEIVED_FROM_REFERRAL  
        });
        
        await newTransaction.save();
        newUser.gfxCoin += REFFERED_USER;
        const newTransactions = new Transactions({
          email: userDetails.email,
          gfxCoin: REFFERED_USER,  
          transactionType: TransactionType.RECEIVED_FROM_REFERRAL  
        });
        await newTransactions.save();
      }
    
      const response = await newUser.save();
      return response;
}

export async function createGoogleuser(session:any){
    const accessToken = await getManagementApiToken();
    const userDetails = await getUserDetails(session.user.sub, accessToken);
      const existingUser = await User.findOne({ email: userDetails.email });
      if (existingUser) {
        throw Error('User already exists');
      }

      const referralCodeGenerated: string = Math.random().toString(36).substring(7);
      const newUser = new User({
        firstName: userDetails.given_name,
        lastName: userDetails.family_name,
        profileImg:userDetails.picture,
        email: userDetails.email,
        referralCode: referralCodeGenerated,
        referredBy: null,
        createdAt: new Date(),
        gfxCoin: SIGNUP
      });

      const newTransaction = new Transactions({
        email: userDetails.email,
        gfxCoin: SIGNUP,  
        transactionType: TransactionType.RECEIVED_FROM_SIGNUP  
      });
      await newTransaction.save();
        newUser.gfxCoin += REFFERED_USER;
        const newTransactions = new Transactions({
          email: userDetails.email,
          gfxCoin: REFFERED_USER,  
          transactionType: TransactionType.RECEIVED_FROM_REFERRAL  
        });
        await newTransactions.save();
       const response = await newUser.save();
       return response;
}