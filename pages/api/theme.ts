// pages/api/theme.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Theme from '../../model/Theme';
import { connectToDatabase } from '../../utils/mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await connectToDatabase();
      const dataList = req.body;

      if (!Array.isArray(dataList)) {
        return res.status(400).json({ success: false, error: 'Invalid data format, expected an array' });
      }

      
      const savedTheme = [];

      for (const data of dataList) {
        const query = { week: data.week };
        const update = data;
        const options = { upsert: true, new: true };
        const updatedTheme = await Theme.updateOne(query, update, options);
        savedTheme.push(updatedTheme);
      }

      res.status(200).json({ success: true, data: savedTheme });
    } catch (error) {
      console.error('Error saving theme:', error);
      res.status(500).json({ success: false, error: 'Error saving data' });
    }
  } 



  if (req.method === 'GET') {
    const { queryType } = req.query;
    if (queryType === "Today") {
      await connectToDatabase();
      const week = req.query.week;
      const theme = await Theme.findOne({week:week});
      res.status(200).json({ success: true,  data:theme });

    }
    else{
    try {
      await connectToDatabase(); 
      const fethcedTheme = await Theme.find().sort({week : 1});
      res.status(200).json({ success: true, data: fethcedTheme });
    } catch (error) {
      console.error('Error saving theme:', error);
      res.status(500).json({ success: false, error: 'Error saving data' });
    }
  }
  } 

  if (req.method === 'DELETE') {
    try {
      const id = req.query.id;
      await connectToDatabase();
      await Theme.deleteOne({_id:id});
      res.status(200).json({ success: true});
    } catch (error) {
      console.error('Error saving theme:', error);
      res.status(500).json({ success: false, error: 'Error delete data' });
    }
  } 

  if (req.method === 'PUT') {
    try {
      const id = req.query.id;
      const data = req.body;
      await connectToDatabase();
      await Theme.findByIdAndUpdate(id,data);
      res.status(200).json({ success: true});
    } catch (error) {
      console.error('Error saving theme:', error);
      res.status(500).json({ success: false, error: 'Error update data' });
    }
  } 
}
