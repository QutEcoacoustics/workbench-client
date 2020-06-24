/**
 * Fetch request with multiple attempts
 * @param input Fetch input details (URL)
 * @param delay Delay amount in milliseconds
 * @param limit Maximum number of attempts
 * @param init Fetch options
 */
export function fetchRetry(
  input: RequestInfo,
  delay: number,
  limit: number,
  init: RequestInit = {}
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const fetchAttempt = (attempt: number) => {
      fetch(input, init).then((response) => {
        // Check if response is OK
        if (response.status !== 200) {
          return retry(attempt);
        }

        // Validate JSON
        try {
          resolve(response.json());
        } catch (err) {
          retry(attempt);
        }
      });
    };

    // Retry fetch
    function retry(attempt: number) {
      if (attempt >= limit - 1) {
        return reject("Failed to fetch item after " + limit + " attempt/s.");
      }

      setTimeout(() => {
        fetchAttempt(++attempt);
      }, delay);
    }

    fetchAttempt(0);
  });
}
