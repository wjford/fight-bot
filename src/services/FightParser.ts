import * as cheerio from 'cheerio';

const baseUrl = 'https://www.ufc.com';

export const parseFights = (html: string): string[] => {
  const $ = cheerio.load(html);

  const links: string[] = [];

  $('div.c-card-event--result__date').map((_index, $el) => {
    const link = `${baseUrl}${$el.firstChild.attribs['href']}`;
    links.push(link);
  });

  return links;
}
