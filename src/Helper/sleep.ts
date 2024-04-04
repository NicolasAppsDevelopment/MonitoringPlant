import { campaignRunner } from '../Campaign/RunCampaign';

export async function sleep(millis:number) {
    return new Promise((resolve) => {
        setTimeout(resolve, millis);
    });
}

export async function sleepUntil(millis:number) {
    return await sleep(millis - new Date().getTime());
}

export async function sleepUntilWhileRunning(millis:number) {
    await await Promise.race([
        sleepUntil(millis),
        new Promise<void>(resolve => {
            const checkInterval = setInterval(() => {
                if (!campaignRunner.isRunning()) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 1000); // check every seconds
        })
    ]);
}