import { campaignRunner } from '../Campaign/RunCampaign';

/**
 * Sleep for a specific amount of time.
 * @param millis - the time to sleep in milliseconds
 */
export async function sleep(millis:number) {
    return new Promise((resolve) => {
        setTimeout(resolve, millis);
    });
}

/**
 * Sleep until a specific date.
 * @param millis - the date to sleep until
 */
export async function sleepUntil(millis:number) {
    return await sleep(millis - new Date().getTime());
}

/**
 * Sleep until a specific date or until the campaign is not running anymore.
 * @param millis - the date to sleep until
 */
export async function sleepUntilWhileRunning(millis:number) {
    await Promise.race([
        sleepUntil(millis),
        new Promise<void>(resolve => {
            const checkInterval = setInterval(() => {
                if (!campaignRunner.isRunning()) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 500); // check every 0.5 seconds
        })
    ]);
}