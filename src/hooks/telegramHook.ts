
import { useContext, useState } from "react";

const usetelegramDrop = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const telegramDrop = async(userId:any)=>{
    setLoading(true);
    setError(null);
    try {
      // alert(`hook ${userId}`);
        const userExistsResponse = await fetch("/api/user");
        // alert(`hook ${userExistsResponse}`);
        const data = await userExistsResponse.json();
        // alert(data.user.isTelegramDropClaimed)
        if(data.user.isTelegramDropClaimed==false){
          // alert("hrlo")
      const res = await fetch(`/api/gfxCoin?queryType=telegramDrop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId:userId}),
      });
      if(res.ok){
        console.log("droped")
        return true;
      }  
    }else{
      return false;
    }
    } catch (error:any) {
      console.log(error.message);
      setError(error.message);
      return false;
    }finally{
      setLoading(false);
    }
  }
  return {telegramDrop, loading, error };
};

export default usetelegramDrop;
