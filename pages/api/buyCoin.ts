import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import { authenticateUser } from "../../utils/verifyToken";
import { GFXCOIN_PER_NEAR ,GFXCOIN_PER_USDC} from "@/config/points";

export default async function handler(req:NextApiRequest,res:NextApiResponse) {
    try {
        await connectToDatabase();
        await authenticateUser(req);
        if(req.method=='GET'){
            try {
                const queryType = req.query.queryType;
                if(queryType=="list"){
                    const queryFilter = req.query.queryFilter;
                    if(queryFilter=="near"){
                        const oneNearInGfxCoin = GFXCOIN_PER_NEAR; 
                        const nearValues = [1, 5, 10, 20, 30, 40, 50, 100];
                        const gfxCoinMap: Record<number, number> = nearValues.reduce((acc, near) => {
                            acc[near] = near * oneNearInGfxCoin;
                            return acc;
                          }, {} as Record<number, number>);
                      
                        return res.status(200).json({ gfxCoinMap });
                    }else if(queryFilter=="usdc"){
                        const oneUsdcInGfxCoin = GFXCOIN_PER_USDC; 
                        const usdcValues = [1, 5, 10, 20, 30, 40, 50, 100];
                        const gfxCoinMap: Record<number, number> = usdcValues.reduce((acc, usdc) => {
                            acc[usdc] = usdc * oneUsdcInGfxCoin;
                            return acc;
                          }, {} as Record<number, number>);
                      
                        return res.status(200).json({ gfxCoinMap });
                    }
                }else if(queryType=="coins"){
                    const queryFilter = req.query.queryFilter;
                    if(queryFilter=="near"){
                        const oneNearInGfxCoin: number = GFXCOIN_PER_NEAR;
                        const coins = Number(req.query.coins);
                        if (isNaN(coins) || coins <= 0) {
                            return res.status(400).json({ message: 'Invalid coins value provided.' });
                          }
                          const totalNear = coins / oneNearInGfxCoin;

                          return res.status(200).json({ totalNear });                          
                    }else if(queryFilter=="usdc"){
                        const oneUsdcInGfxCoin: number = GFXCOIN_PER_USDC;
                        const coins = Number(req.query.coins);
                        if (isNaN(coins) || coins <= 0) {
                            return res.status(400).json({ message: 'Invalid coins value provided.' });
                          }
                          const totalUsdc = coins / oneUsdcInGfxCoin;
                          return res.status(200).json({ totalUsdc });  
                    }
                }
            } catch (error:any) {
                res.status(400).json({error:error.message});
            }
        }
    } catch (error:any) {
        res.status(400).json({error:error.message});
    }    
}