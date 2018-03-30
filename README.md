# manga-pdf

This is a very simple playground tool that downloads images of a specific manga by a provided URL and merges them into a single PDF document.

The tool uses [Mangakalot](http://mangakakalot.com/).

## How to run this tool

Firstly you need to install all dependecies:

```sh
$ yarn
```

```sh
$ yarn start
```

or if you have electron installed globally

```sh
$ electron bin/index.js <url> [output]
```

## The idea

A friend of mine is a Manga Fan and has shown me the site where he reads it.

## What this tool does

You provide the tool with a url of the manga's first chapter.

The tool:

0.  Loads all images for each chapter.
1.  Merges images of all chapters into a single PDF document.
