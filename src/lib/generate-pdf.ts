const program = require('commander');
const download = require('download');
const isUrl = require('is-url');
const cheerio = require('cheerio');
const PDF = require('pdfkit');
const sizeOf = require('image-size');
const fs = require('fs');
const path = require('path');
const version = require('../package.json').version;

const SELECTOR = '#vungdoc img';
const CHAPTERS = '#c_chapter option';
const DEFAULT_OUTPUT = 'manga-merge.pdf';

program
  .version(version)
  .option('-m, --merge', 'Merges all images of a chapter into a single page')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}

const resolveOutput = output =>
  output
    ? path.isAbsolute(output) ? output : path.join(process.cwd(), output)
    : path.join(process.cwd(), DEFAULT_OUTPUT);

const downloadImages = async webpage => {
  const imageTags = cheerio.load(webpage)(SELECTOR);
  const urls = Object.keys(imageTags)
    .filter(index => imageTags[index].name && imageTags[index].name == 'img')
    .map(key => imageTags[key].attribs.src);
  return await Promise.all(urls.map(url => download(url)));
};

const addPage = pdf => image => {
  const { height, width } = sizeOf(image);
  pdf.addPage({
    margin: 0,
    size: [width, height]
  });
  pdf.image(image);
};

const getWebpages = async url => {
  const page = await download(url);
  const baseUrl = `${url.substr(0, url.lastIndexOf('/') + 1)}chapter_`;
  const elements = cheerio.load(page)(CHAPTERS);
  const pages = await Promise.all(
    Object.keys(elements)
      .filter(
        key =>
          elements[key].attribs &&
          elements[key].attribs.value &&
          !elements[key].attribs.selected
      )
      .map(key => download(baseUrl + elements[key].attribs.value))
  );
  pages.unshift(page);
  return pages;
};

const generatePdf = async () => {
  const url = process.argv[2];
  const output = resolveOutput(process.argv[3]);
  const pages = await getWebpages(url);
  const document = new PDF({ autoFirstPage: false });
  document.pipe(fs.createWriteStream(output));
  const imagesSet = await Promise.all(pages.map(page => downloadImages(page)));
  imagesSet.map(images => images.map(addPage(document)));
  document.end();
};
