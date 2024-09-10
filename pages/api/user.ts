import type { NextApiRequest, NextApiResponse} from 'next';
import { connectToDatabase } from '../../utils/mongoose';
import User from '../../model/User';
import ArtTable from '../../model/ArtTable';
export default async function handler(req:NextApiRequest,res:NextApiResponse){

    if(req.method=='POST'){
        try{
        await connectToDatabase();
        const data = req.body;
        const response = await User.create(data);
        res.status(201).json({message:"Profile created successfully"});
        }
        catch(error){
            res.status(500).json({error});
        }
    }
    if(req.method=='GET'){
        const queryType = req.query.queryType;
        if(queryType=='arts'){
            try{
            await connectToDatabase();
            const walletAddress = req.query.walletAddress;
            const arts = await ArtTable.find({artistId:walletAddress});
            res.status(200).json({data:arts});
            }
            catch(error){
                res.status(500).json({error:error});
            }
        }
        try{
        await connectToDatabase();
        const id = req.query.id;
        const profiles = await User.findById({_id:id});
        res.status(200).json({data:profiles});
        }catch(error){
            res.status(500).json({error});
        }
    }

    if(req.method=='PUT'){
        try{
        await connectToDatabase();
        const id = req.query.id;
        const data = req.body;
        const profile = await User.findByIdAndUpdate(id,data);
        res.status(200).json({message:"Updated successfully"});
        }catch(error){
            res.status(500).json({error});
        }
    }
} 

