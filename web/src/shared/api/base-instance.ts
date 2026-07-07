export const baseFetch = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) throw new Error(`API errror: ${res.status}`);
  return res.json();
}