import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../utils/mongoose";
import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import Otp from "../../model/Otp";
import { ADMIN_GMAIL, ADMIN_PASS } from "@/config/constants";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
        if(req.method=='POST'){
            await connectToDatabase();
            const {email} = req.body;
            try{
                const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false,  lowerCaseAlphabets: false, digits: true,});
                const otpExpiresAt = Date.now() + 10 * 60 * 1000;  
                const existingOtp = await Otp.findOne({ email });
                  if (existingOtp) {
                  existingOtp.otp = otp;
                  existingOtp.otpExpiresAt = otpExpiresAt;
                  await existingOtp.save();
                } else {
                  const newOtp = new Otp({
                    email,
                    otp,
                    otpExpiresAt,
                  });
                  await newOtp.save();
                }
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: ADMIN_GMAIL,
                      pass: ADMIN_PASS
                    }
                  });
                  const mailOptions = {
                    from: ADMIN_GMAIL,
                    to: email,
                    subject: 'Your OTP Code',
                    html: `<p>Your OTP code is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
                  };
                  await transporter.sendMail(mailOptions);
                  res.status(200).json({ message: 'OTP sent to email successfully' });              
            }
            catch(err:any){
              console.log(err);
                res.status(500).json({ error: 'Error sending OTP' });
            }
        }
    }
    catch(err:any){
        res.status(500).json({ error: err });
    }
}