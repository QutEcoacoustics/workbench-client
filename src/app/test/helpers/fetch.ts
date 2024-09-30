export function mockFetchResponse(url: string, response: any) {
  const originalFetch = window.fetch;

  window.fetch = async (input: RequestInfo, init?: RequestInit) => {
    if (typeof input === "string" && input === url) {
      return {
        json: async () => response,
      } as Response;
    }

    return originalFetch(input, init);
  };
}
