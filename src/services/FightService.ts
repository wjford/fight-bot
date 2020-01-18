import axios from 'axios';

export const fetchFights = async (): Promise<string> => {
  try {
    const res = await axios.get('https://www.ufc.com/events');
    const data: string = res.data;
    return data;
  } catch (error) {
    console.error(error);
    return '';
  }
};
