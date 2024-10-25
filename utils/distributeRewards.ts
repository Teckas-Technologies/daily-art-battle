import ArtTable from "../model/ArtTable";
import campaign from "../model/campaign";
import Transactions from "../model/Transactions";
import User from "../model/User";

export default async function automateReward(){
    try{
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        const campaigns = await campaign.find({isSpecialRewards:true,distributedRewards:false,  endDate: { $gte: sevenDaysAgo, $lte: today }});
        for(const campaign of campaigns){
            console.log(campaign);
            const arts = await ArtTable.find({campaignId:campaign._id}).select('email');
            const emailList = arts.map(art => art.email);
            const rewardPerUser = campaign.specialRewards / campaign.specialWinnerCount;
            if(emailList.length<=campaign.specialWinnerCount){
                await distribute(emailList,rewardPerUser);
            }else{
                const randomEmails = await selectRandomWinners(emailList,campaign.specialWinnerCount);
                await distribute(randomEmails,rewardPerUser);
            }
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
                transactionType: "received"
            });
            await newTransaction.save();
        })
    );
}

const selectRandomWinners = async(users: any[], count: number) => {
    if (users.length === 0 || count <= 0) return []; 
    const uniqueWinners = new Set();
    
    while (uniqueWinners.size < Math.min(count, users.length)) {
        const randomIndex = Math.floor(Math.random() * users.length);
        uniqueWinners.add(users[randomIndex]); 
    }
    
    return Array.from(uniqueWinners); 
};