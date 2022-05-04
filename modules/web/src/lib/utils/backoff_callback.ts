import { sleep } from "$lib/utils/sleep";

export function backoffCallback(toTry: () => Promise<void>, maxAttempts = 2, delay = 100) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await toTry();
      resolve(data);
    } catch (error: any) {
      if (maxAttempts > 0) {
        await sleep(delay);
        await backoffCallback(toTry, --maxAttempts, delay * 2);
      } else {
        reject(error.message);
      }
    }
  });
}
