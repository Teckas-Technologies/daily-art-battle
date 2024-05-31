const { CronJob } = require('cron');

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

const cronJob = new CronJob(
    '*/1 * * * *',
    async function() {
        try {
            const response = await fetch(`${baseUrl}/api/mintNfts`, { 
                method: 'GET'
            });

            if (response.ok) {
                console.log("API call successful");
            } else {
                throw new Error('Failed to save data');
            }
        } catch (error) {
            console.error('Error saving data:', error);
        }
    },
    null,
    true,
    'America/Los_Angeles'
);
cronJob.start(); 
