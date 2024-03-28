export async function sleep(millis:number) {
    return new Promise((resolve) => {
        setTimeout(resolve, millis);
    });
}

export async function sleepUntil(millis:number) {
    return await sleep(millis - new Date().getTime());
}