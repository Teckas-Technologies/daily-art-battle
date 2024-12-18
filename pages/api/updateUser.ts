import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import { getManagementApiToken, getUserDetails } from "../../utils/userDetails";
import axios from "axios";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import User from "../../model/User";

export default withApiAuthRequired(async function handler(req:NextApiRequest,res:NextApiResponse){
    try {
        await connectToDatabase();
        if(req.method=="POST"){
            const {firstName,lastName} = req.body;
            const session = await getSession(req, res);
            if (!session || !session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
            }
            const accessToken = await getManagementApiToken();
            const userDetails = await getUserDetails(session.user.sub, accessToken);
            const email = userDetails.email;
            let referralCode = null;
            if (userDetails.user_metadata && userDetails.user_metadata.referral_code) {
              referralCode = userDetails.user_metadata.referral_code;
              console.log("Referral Code:", referralCode);
            }
            console.log(firstName,lastName);
            let data = JSON.stringify({
                "user_metadata": {
                  "family_name": lastName,
                  "given_name": firstName,
                  "referral_code":referralCode,
                }
              });
              
              let config = {
                method: 'patch',
                maxBodyLength: Infinity,
                url: 'https://dev-zypdnx4uu6aa115f.us.auth0.com/api/v2/users/google-oauth2%7C112620593158854144478',
                headers: { 
                  'Content-Type': 'application/json', 
                  'Accept': 'application/json', 
                  'Authorization': `Bearer ${accessToken}`
                },
                data : data
              };
              
              try {
                const response = await axios.request(config);
                console.log("Auth0 update response:", response.data);
              } catch (error:any) {
                res.status(400).json({error: error.message});
              }
                const updateUser = await User.findOne({email:email});
                if (!updateUser) {
                    return res.status(404).json({ message: "User not found in the database" });
                  }
                updateUser.firstName = firstName;
                updateUser.lastName = lastName;
                await updateUser.save();
                console.log(updateUser);
                if (!updateUser) {
                return res.status(404).json({ message: "User not found in the database" });
                }
                res.status(200).json({data:updateUser});
        }
    } catch (error:any) {
        res.status(400).json({error:error.message});
    }
})