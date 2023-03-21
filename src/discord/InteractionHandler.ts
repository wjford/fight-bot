import {
  GuildChannelManager,
  CommandInteraction,
  GuildScheduledEventCreateOptions,
  Interaction,
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
  SelectMenuInteraction,
} from 'discord.js';
import { Event, parseEvent, parseEvents } from '../services/FightParser';
import Logger from '../services/Logging/Logger';
import UfcService from '../services/UfcService';
import { eventToDate } from '../util/Parsers';

export default class InteractionHandler {
  private readonly logger: Logger;
  private readonly dataService: UfcService;

  public constructor(logger: Logger, dataService: UfcService) {
    this.logger = logger;
    this.dataService = dataService;

    this.buildFightEmbed = this.buildFightEmbed.bind(this);
    this.handleCommand = this.handleCommand.bind(this);
    this.handleSelectMenu = this.handleSelectMenu.bind(this);
    this.getFightLink = this.getFightLink.bind(this);
    this.getFightLinks = this.getFightLinks.bind(this);
    this.getEvent = this.getEvent.bind(this);
    this.handleFightEvent = this.handleFightEvent.bind(this);
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
      case 'fight-event':
        this.handleFightEvent(interaction);
        break;
      default:
        this.logger.info(`Command not supported - ${command}`);
        break;
    }
  }

  private async handleSelectMenu(
    interaction: SelectMenuInteraction,
    menuId: string
  ): Promise<void> {
    this.logger.info(`Processing menu - ${menuId}`);

    switch (menuId) {
      case 'event-channel':
        this.handleEventChannel(interaction);
        break;
      default:
        this.logger.info(`Menu not supported - ${menuId}`);
        break;
    }
  }

  private async getFightLink(): Promise<string> {
    const links = await this.getFightLinks();
    let link = links.shift();
    const event: Event = await this.getEvent(link);
    const now: Date = new Date(Date.now());

    // If current fight is outdated, grab the next one
    if (eventToDate(this.logger, event) < now) {
      link = links.shift();
    }

    return link;
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

  private async getEvent(link: string): Promise<Event> {
    const eventHtml = await this.dataService.fetchData<string>(link);

    return parseEvent(eventHtml);
  }

  private async handleFights(interaction: CommandInteraction): Promise<void> {
    const links = await this.getFightLinks();
    interaction.reply(links.join('\n'));
  }

  private async handleFight(interaction: CommandInteraction): Promise<void> {
    const link = await this.getFightLink();

    const eventHtml = await this.dataService.fetchData<string>(link);
    const event = parseEvent(eventHtml);

    await interaction.reply({ embeds: [this.buildFightEmbed(event, link)] });
  }

  private async handleFightEvent(
    interaction: CommandInteraction
  ): Promise<void> {
    const channels: GuildChannelManager = interaction.guild.channels;

    const msg: MessageActionRow = new MessageActionRow();
    const menu: MessageSelectMenu = new MessageSelectMenu();
    menu.setCustomId('event-channel');
    for (const [id, channel] of channels.cache.entries()) {
      this.logger.debug(
        `id: ${id.toString()} name: ${
          channel.name
        } isVoice: ${channel.isVoice()}`
      );
      if (channel.isVoice()) {
        menu.addOptions([
          {
            label: channel.name,
            value: id.toString(),
          },
        ]);
      }
    }

    msg.addComponents(menu);

    await interaction.reply({
      content: 'Please select the channel for the event',
      components: [msg],
    });
  }

  private async handleEventChannel(
    interaction: SelectMenuInteraction
  ): Promise<void> {
    const link = await this.getFightLink();
    const event: Event = await this.getEvent(link);

    const channelId = interaction.values.pop();
    const re = /\s+/g;
    const subtitle = event.subtitle.replace(re, ' ');
    const title = `${event.title}: ${subtitle}`;
    let description = '';
    for (const fight of event.fights) {
      if (fight.redCorner.name && fight.blueCorner.name) {
        description = description.concat(
          `${fight.blueCorner.name.replace(
            re,
            ' '
          )} vs. ${fight.redCorner.name.replace(re, ' ')}\n`
        );
      }
    }

    const eventCreateOptions: GuildScheduledEventCreateOptions = {
      name: title,
      description: description,
      scheduledStartTime: eventToDate(this.logger, event),
      channel: channelId,
      entityType: 'VOICE',
      privacyLevel: 'GUILD_ONLY',
    };

    interaction.guild.scheduledEvents.create(eventCreateOptions);

    await interaction.update(`Created event: ${title}`);
  }

  public handleInteraction(interaction: Interaction): void {
    if (interaction.isCommand()) {
      const { commandName } = interaction;

      this.handleCommand(interaction, commandName);
    } else if (interaction.isSelectMenu()) {
      this.handleSelectMenu(interaction, interaction.customId);
    } else {
      return;
    }
  }
}
