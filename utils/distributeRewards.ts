import ArtTable from "../model/ArtTable";
import Campaign from "../model/campaign";
import { TransactionType } from "../model/enum/TransactionType";
import Transactions from "../model/Transactions";
import User from "../model/User";

export default async function automateReward(){
    try{
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        const campaigns = await Campaign.find({isSpecialRewards:true,distributedRewards:false,  endDate: { $gte: sevenDaysAgo, $lte: today }});
        for(const campaign of campaigns){
            const arts = await ArtTable.find({ campaignId: campaign._id });
            const rewardPerUser = campaign.specialRewards / campaign.specialWinnerCount;
            console.log(rewardPerUser);
            if(arts.length<=campaign.specialWinnerCount){
                await distribute(arts,rewardPerUser);
                await Campaign.updateOne(
                    { _id: campaign._id },
                    {
                      $addToSet: {
                        specialRewardsArtId: { $each: arts.map((art:any) => art._id) }
                      },
                      $set: { distributedRewards: true }
                    }
                  );
            }else{
                const randomArts = await selectRandomWinners(arts,campaign.specialWinnerCount);
                await distribute(randomArts,rewardPerUser);
                await Campaign.updateOne(
                    { _id: campaign._id },
                    {
                      $addToSet: {
                        specialRewardsArtId: { $each: randomArts.map((art:any) => art._id) }
                      },
                      $set: { distributedRewards: true }
                    }
                  );
            }
            await Campaign.updateOne(
                { _id: campaign._id },
                {
                  $set: { distributedRewards: true }
                }
              );
        }
    }catch(error:any){
         throw Error(error.message);
    }
}

const distribute = async(artList: any[],rewardPerUser:any)=>{
    await Promise.all(
        artList.map(async (art: any) => {
            const userEmail = art.email;
            await User.updateOne(
                { email: userEmail },
                { $inc: { gfxCoin: rewardPerUser } }
            );
            const newTransaction = new Transactions({
                email: userEmail,
                gfxCoin: rewardPerUser,
                transactionType: TransactionType.RECEIVED_FROM_SPECIAL_REWARD
            });
            await newTransaction.save();
        })
    );
}

const selectRandomWinners = async(users: any[], count: number) => {
    console.log("uniqueWinners");
    if (users.length === 0 || count <= 0) return []; 
    const uniqueWinners = new Set();
    
    while (uniqueWinners.size < Math.min(count, users.length)) {
        const randomIndex = Math.floor(Math.random() * users.length);
        uniqueWinners.add(users[randomIndex]); 
    }
    
    return Array.from(uniqueWinners); 
};