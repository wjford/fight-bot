import { CommandInteraction, Interaction, MessageEmbed } from 'discord.js';
import { Event, parseEvent, parseEvents } from '../services/FightParser';
import Logger from '../services/Logging/Logger';
import UfcService from '../services/UfcService';

export default class InteractionHandler {
  private readonly logger: Logger;
  private readonly dataService: UfcService;

  public constructor(logger: Logger, dataService: UfcService) {
    this.logger = logger;
    this.dataService = dataService;

    this.buildFightEmbed = this.buildFightEmbed.bind(this);
    this.handleCommand = this.handleCommand.bind(this);
    this.getFightLinks = this.getFightLinks.bind(this);
    this.handleFight = this.handleFight.bind(this);
    this.handleFights = this.handleFights.bind(this);
    this.handleInteraction = this.handleInteraction.bind(this);
  }

  private buildFightEmbed(event: Event, url: string): MessageEmbed {
    const embed = new MessageEmbed();

    embed.setTitle(event.title);
    embed.setURL(url);
    embed.setDescription(`${event.subtitle}\n${event.date}`);
    embed.setThumbnail(event.imgUrl);

    event.fights.forEach((fight) => {
      embed.addField(
        fight.weightClass || 'Unknown',
        `${fight.redCorner.rank} ${fight.redCorner.name}\nvs.\n${fight.blueCorner.rank} ${fight.blueCorner.name}`,
        true
      );
    });

    return embed;
  }

  private async handleCommand(
    interaction: CommandInteraction,
    command: string
  ): Promise<void> {
    this.logger.info(`Processing command - ${command}`);

    switch (command) {
      case 'fight':
        this.handleFight(interaction);
        break;
      case 'fights':
        this.handleFights(interaction);
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

  private async handleFights(interaction: CommandInteraction): Promise<void> {
    const links = await this.getFightLinks();
    interaction.reply(links.join('\n'));
  }

  private async handleFight(interaction: CommandInteraction): Promise<void> {
    const links = await this.getFightLinks();

    if (links.length === 0) {
      interaction.channel.send('Failed retriving event information from UFC');
      return;
    }

    const [link] = links;

    const eventHtml = await this.dataService.fetchData<string>(link);
    const event = parseEvent(eventHtml);

    await interaction.reply({ embeds: [this.buildFightEmbed(event, link)] });
  }

  public handleInteraction(interaction: Interaction): void {
    if (!interaction.isCommand()) {
      return;
    }

    const { commandName } = interaction;

    this.handleCommand(interaction, commandName);
  }
}
