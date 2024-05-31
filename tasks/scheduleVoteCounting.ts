import cron from 'node-cron';
import { countVotesAndUpdateBattle } from '../utils/countVotesAndBattles';

// Schedule the task to run every minute
cron.schedule('* * * * *', async () => {
  console.log('Checking and updating battles...');
  try {
    await countVotesAndUpdateBattle();
    console.log('Updated battles successfully.');
  } catch (error) {
    console.error('Failed to update battles:', error);
  }
});
