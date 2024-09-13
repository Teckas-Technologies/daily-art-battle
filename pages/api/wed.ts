// import { NextApiRequest, NextApiResponse } from "next";
// import { connectToDatabase } from "../../utils/mongoose";
// import Battle from "../../model/Battle";
// import ArtTable from "../../model/ArtTable";

// export default async function handler(req:NextApiRequest,res:NextApiResponse){
//     if(req.method=='GET'){
//         await connectToDatabase();
//         const arts = await Battle.find({}).limit(8).sort({startTime:-1}).skip(1);
//         let c = 0;
//         let artt = null;
//        for(const art of arts){
//         const artA = await ArtTable.findOne({_id:art.artAId});
//         console.log(artA);
//         const artB = await ArtTable.findOne({_id:art.artBId});
//         console.log(artB);
//         if(artA.upVotes>c){
//             console.log(artA.upVotes)
//             c = artA.upVotes;
//             artt = artA;
//         }else if(artB.upVotes>c){
//             console.log(artB.upVotes)
//             c = artB.upVotes;
//             artt = artB;
//         }
//         // if(art.artAVotes>c){
//         //     console.log(art.artAVotes)   
//         //     c = art.artAVotes;
//         //     artt = art;
//         // }else if(art.artBVotes>c){
//         //     console.log(art.artAVotes)
//         //     c = art.artAVotes;
//         //     artt = art;
//         // }
//        }
//        res.status(200).json({artt});
//     }
// }