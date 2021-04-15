import { sleep } from "@/app/lib/utils/sleep";

export function attemptWithBackoff(toTry: CallableFunction, maxAttempts = 2, delay = 100) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await toTry();
      resolve(data)
    } catch(err) {
      if (maxAttempts > 0) {
        await sleep(delay);
        await attemptWithBackoff(toTry, --maxAttempts, delay * 2);
      } else {
        reject(err.message);
      }
    }
  })
}
