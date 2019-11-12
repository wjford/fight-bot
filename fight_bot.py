import os
from signal import SIGINT, signal
from sys import exit

import discord
import requests
from bs4 import BeautifulSoup
from discord.ext import commands

token = os.environ['FIGHTBOT_TOKEN']

bot = commands.Bot(command_prefix='$')


def handler(signal_received, frame):
    # Handle any cleanup here
    print('SIGINT or CTRL-C detected. Exiting gracefully')
    exit(0)


signal(SIGINT, handler)


@bot.command()
async def ping(ctx):
    await ctx.send('pong')


@bot.command()
async def ding(ctx):
    await ctx.send('dong')


def fetch_fights():
    base_url = "https://www.ufc.com"
    r = requests.get(base_url + "/events")

    soup = BeautifulSoup(r.text, 'html.parser')

    divs = soup.find_all('div', class_="c-card-event--result__date")

    links = list()

    for div in divs:
        link = base_url + div.next.attrs['href']
        links.append(link)
    return links


@bot.command()
async def fight(ctx):
    links = fetch_fights()

    await ctx.send(links[0])


@bot.command()
async def fights(ctx):
    links = fetch_fights()

    link_string = '\n'.join(links)

    await ctx.send(link_string)

bot.run(token)
