import axios from 'axios';
import Logger from './Logging/Logger';

export default class UfcService {
  private readonly logger: Logger;
  private static readonly EVENTS_URL = 'https://www.ufc.com/events';

  public constructor(logger: Logger) {
    this.logger = logger;

    this.fetchData = this.fetchData.bind(this);
    this.fetchEvents = this.fetchEvents.bind(this);
  }

  public async fetchData<T>(url: string): Promise<T> {
    try {
      const res = await axios.get(url);
      const data: T = res.data;
      return data;
    } catch (error) {
      this.logger.error(error.message);
      return undefined;
    }
  }

  public async fetchEvents(): Promise<string> {
    return this.fetchData<string>(UfcService.EVENTS_URL);
  }
}
