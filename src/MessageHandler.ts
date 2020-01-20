import { Message, RichEmbed } from 'discord.js';
import { Event, parseEvent, parseEvents } from './services/FightParser';
import { fetchData, fetchEvents } from './services/FightService';

const buildFightEmbed = (event: Event, url: string): RichEmbed => {
  const embed = new RichEmbed();

  embed.setTitle(event.title);
  embed.setURL(url);
  embed.setDescription(`${event.subtitle}\n${event.date}`);
  embed.setThumbnail(event.imgUrl);

  event.fights.forEach(fight => {
    embed.addField(
      fight.weightClass,
      `${fight.redCorner.rank} ${fight.redCorner.name}\nvs.\n${fight.blueCorner.rank} ${fight.blueCorner.name}`,
      true
    );
  });

  return embed;
};

const getFightLinks = async (): Promise<string[]> => {
  const eventHtml = await fetchEvents();
  const links = parseEvents(eventHtml);
  return links;
};

const handleFights = async (message: Message): Promise<void> => {
  const links = await getFightLinks();
  message.channel.send(links.join('\n'));
};

const handleFight = async (message: Message): Promise<void> => {
  const links = await getFightLinks();
  const [link] = links;

  const eventHtml = await fetchData<string>(link);

  const event: Event = parseEvent(eventHtml);

  message.channel.send(buildFightEmbed(event, link));
};

const handleCommand = async (
  message: Message,
  command: string
): Promise<void> => {
  switch (command) {
    case 'fight':
      handleFight(message);
      break;
    case 'fights':
      handleFights(message);
      break;
  }
};

const MessageHandler = (prefix: string) => (message: Message): void => {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

  const args = message.content.slice(prefix.length).split(' ');
  const command = args.shift().toLowerCase();

  handleCommand(message, command);
};

export default MessageHandler;
