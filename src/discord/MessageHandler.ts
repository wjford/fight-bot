import { Message, MessageEmbed } from 'discord.js';
import { Event, parseEvent, parseEvents } from '../services/FightParser';
import Logger from '../services/Logging/Logger';
import UfcService from '../services/UfcService';
import Environment from '../util/Environment';

export default class MessageHandler {
  private readonly prefix: string;
  private readonly logger: Logger;
  private readonly dataService: UfcService;

  public constructor(
    env: Environment,
    logger: Logger,
    dataService: UfcService
  ) {
    this.prefix = env.PREFIX;
    this.logger = logger;
    this.dataService = dataService;

    this.buildFightEmbed = this.buildFightEmbed.bind(this);
    this.handleCommand = this.handleCommand.bind(this);
    this.getFightLinks = this.getFightLinks.bind(this);
    this.handleFight = this.handleFight.bind(this);
    this.handleFights = this.handleFights.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  private buildFightEmbed(event: Event, url: string): MessageEmbed {
    const embed = new MessageEmbed();

    embed.setTitle(event.title);
    embed.setURL(url);
    embed.setDescription(`${event.subtitle}\n${event.date}`);
    embed.setThumbnail(event.imgUrl);

    event.fights.forEach(fight => {
      embed.addField(
        fight.weightClass || 'Unknown',
        `${fight.redCorner.rank} ${fight.redCorner.name}\nvs.\n${fight.blueCorner.rank} ${fight.blueCorner.name}`,
        true
      );
    });

    return embed;
  }

  private async handleCommand(
    message: Message,
    command: string
  ): Promise<void> {
    this.logger.info(`Processing command - ${this.prefix}${command}`);

    switch (command) {
      case 'fight':
        this.handleFight(message);
        break;
      case 'fights':
        this.handleFights(message);
        break;
      default:
        this.logger.info(`Command not supported - ${command}`);
        break;
    }
  }

  private async getFightLinks(): Promise<string[]> {
    try {
      const eventHtml = await this.dataService.fetchEvents();
      const links = parseEvents(eventHtml);
      return links;
    } catch (error) {
      this.logger.error(
        `Failed retrieving events from UFC website - ${error.message}`
      );
      return [];
    }
  }

  private async handleFights(message: Message): Promise<void> {
    const links = await this.getFightLinks();
    message.channel.send(links.join('\n'));
  }

  private async handleFight(message: Message): Promise<void> {
    const links = await this.getFightLinks();

    if (links.length === 0) {
      message.channel.send('Failed retriving event information from UFC');
      return;
    }

    const [link] = links;

    const eventHtml = await this.dataService.fetchData<string>(link);

    const event: Event = parseEvent(eventHtml);

    message.channel.send(this.buildFightEmbed(event, link));
  }

  public handleMessage(message: Message): void {
    if (!message.content.startsWith(this.prefix) || message.author.bot) {
      return;
    }

    const args = message.content.slice(this.prefix.length).split(' ');
    const command = args.shift().toLowerCase();

    this.handleCommand(message, command);
  }
}
