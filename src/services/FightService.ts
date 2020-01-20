import axios from 'axios';

export const fetchData = async <T>(url: string): Promise<T> => {
  try {
    const res = await axios.get(url);
    const data: T = res.data;
    return data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const fetchEvents = async (): Promise<string> => {
  return fetchData<string>('https://www.ufc.com/events');
};
