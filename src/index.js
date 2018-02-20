const program = require('commander');
const download = require('download');
const isUrl = require('is-url');
const cheerio = require('cheerio');
const PDF = require('pdfkit');
const sizeOf = require('image-size');
const fs = require('fs');
const version = require('../package.json').version;

const SELECTOR = '#vungdoc img';
const OUTPUT_FILE_NAME = 'manga-merge.pdf';

program
  .version(version)
  .option('-m, --merge', 'Merges all images of a chapter into a single page')
  .parse(process.argv);

if (process.argv.slice(2).length != 1) {
  program.help();
}

const url = process.argv[2];

const downloadImages = async url => {
  const website = await download(url);
  const imageTags = cheerio.load(website)(SELECTOR);
  const urls = Object.keys(imageTags)
    .filter(index => imageTags[index].name && imageTags[index].name == 'img')
    .map(key => imageTags[key].attribs.src);
  return await Promise.all(urls.map(url => download(url)));
};

const addPage = pdf => image => {
  const { height, width } = sizeOf(image);
  pdf.image(image);
};

const getSizeParameters = images => {
  const sizes = images.map(image => sizeOf(image));
  const maxWidth = sizes.sort((a, b) => b.width - a.width)[0].width;
  const totalHeight = sizes.reduce((a, b) => a + b.height, 0);
  return [maxWidth, totalHeight];
};

const main = async () => {
  const images = await downloadImages(url);
  const size = getSizeParameters(images);
  const document = new PDF({ autoFirstPage: false });
  document.pipe(fs.createWriteStream(OUTPUT_FILE_NAME));
  document.addPage({
    margin: 0,
    size
  });
  images.map(addPage(document));
  document.end();
};

main();
