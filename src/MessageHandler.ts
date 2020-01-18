import { Message } from 'discord.js';
import { parseFights } from './services/FightParser';
import { fetchFights } from './services/FightService';

const getFightLinks = async (): Promise<string[]> => {
  const eventHtml = await fetchFights();
  const links = parseFights(eventHtml);
  return links;
};

const handleFights = async (message: Message): Promise<void> => {
  const links = await getFightLinks();
  message.channel.send(links.join('\n'));
};

const handleFight = async (message: Message): Promise<void> => {
  const links = await getFightLinks();
  const [link] = links;

  message.channel.send(link);
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
  console.log(message.content);
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

  const args = message.content.slice(prefix.length).split(' ');
  const command = args.shift().toLowerCase();

  handleCommand(message, command);
};

export default MessageHandler;
