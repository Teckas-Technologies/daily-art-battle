import { RAFFLE_TICKET } from "@/config/points";

export default async function calaculateRafflePoints(ticketCount:any){
    const totalCoins = ticketCount * RAFFLE_TICKET;
    return totalCoins;
}