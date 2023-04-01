import * as Cheerio from 'cheerio';

const baseUrl = 'https://www.ufc.com';

const titleClass = '.c-hero__headline-prefix';
const subtitleClass = '.c-hero__headline.is-large-text';
const dateClass = '.c-hero__headline-suffix';

const weightClass = 'div.c-listing-fight__details > div.c-listing-fight__class';
const oddsClass = '.c-listing-fight__odds';

const fighterClass = '.c-listing-fight__corner-name';
const rankClass = '.c-listing-fight__corner-rank';

const imgClass = '.c-hero__image';

export interface FightCorner {
  name: string;
  rank: string;
  odds: string;
}

export interface Fight {
  redCorner: FightCorner;
  blueCorner: FightCorner;
  weightClass: string;
}

export interface Event {
  title: string;
  subtitle: string;
  date: string;
  imgUrl: string;
  fights: Fight[];
}

export const parseEvents = (html: string): string[] => {
  const $ = Cheerio.load(html);

  const links: string[] = [];

  $('.c-card-event--result__headline').map((_index, $el) => {
    const child: Cheerio.Element = $el.firstChild as Cheerio.Element;
    const link = `${baseUrl}${child.attribs['href']}`;
    links.push(link);
  });

  return links;
};

const parseImage = ($: Cheerio.CheerioAPI): string => {
  const imgHero = $(imgClass);
  const img = imgHero.find('img');
  return img?.attr('src') ?? '';
};

export const parseEvent = (html: string): Event => {
  const $ = Cheerio.load(html);

  const fighters: string[] = $(fighterClass)
    .map((_, el) => $(el).text().trim().replace(/\n/g, ''))
    .get();
  const ranks: string[] = $(rankClass)
    .map((_, el) => $(el).text().trim().replace(/\n/g, ''))
    .get();
  const weightClasses: string[] = $(weightClass)
    .map((_, el) => $(el).text().trim().replace(/\n/g, ''))
    .get();
  const oddsClasses: string[] = $(oddsClass)
    .map((_, el) => $(el).text().trim().replace(/\n/g, ''))
    .get();

  let i = 0;
  const fights: Fight[] = weightClasses.map((weightClass) => {
    const fight: Fight = {
      weightClass: weightClass.replace(/ +/g, ' ').trim(),
      redCorner: {
        name: fighters[i],
        rank: ranks[i],
        odds: oddsClasses[i],
      },
      blueCorner: {
        name: fighters[i + 1],
        rank: ranks[i + 1],
        odds: oddsClasses[i + 1],
      },
    };

    i += 2;

    return fight;
  });

  const title = $(titleClass).text().trim().replace(/\n/g, '');
  const subtitle = $(subtitleClass)
    .text()
    .trim()
    .replace(/\n/g, '')
    .replace(/ +/g, ' ');
  const date = $(dateClass).text().trim();
  const imgUrl = parseImage($);

  return {
    title,
    subtitle,
    date,
    fights,
    imgUrl,
  };
};
