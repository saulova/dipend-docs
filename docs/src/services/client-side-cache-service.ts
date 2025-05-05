class ClientSideCacheService {
  public get<T>(key: string): T | undefined {
    const cached = localStorage?.getItem(key);

    if (cached) {
      const { data, until } = JSON.parse(cached);

      const isValid = until === undefined || new Date() < new Date(until);

      if (isValid) {
        return data;
      }
    }

    return undefined;
  }

  public set<T>(key: string, data: T, until?: Date) {
    localStorage.setItem(
      key,
      JSON.stringify({
        data,
        ...(until ? { until } : {}),
      }),
    );
  }
}

export const clientSideCacheService = new ClientSideCacheService();
