import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

function cacheGet(name) {
    if (fs.existsSync(`./cache/${name}.html`)) {
        return fs.readFileSync(`./cache/${name}.html`);
    }
    return false;
}

function cacheSet(name, value) {
    if (!fs.existsSync('./cache')) {
        fs.mkdirSync('./cache');
    }
    fs.writeFileSync(`./cache/${name}.html`, value);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

for (let i = 0; i < 10; i++) {
    const comicId = 603 - i;
    const url = `https://existentialcomics.com/comic/${comicId}`;
    let name = `comic_${comicId}`;
    let data = cacheGet(name);

    if (!data) {
        console.log("LIVE REQUEST!!!!!!");
        await sleep(1000);
        const res = await axios.get(url);
        data = res.data;
        cacheSet(name, data);
    }

    const $ = cheerio.load(data);
    const src = $(".comicImg").attr("src");
    const comicTitle = $(".title h3").text();
    console.log(`Title: ${comicTitle}`);
    console.log(`Image: https:${src}`);
    console.log(`Url: ${url}`);
    console.log("");
}