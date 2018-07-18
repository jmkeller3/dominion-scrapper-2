const fs = require('fs');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const http = require('http');

const jsonPayload = {
    "Base": [],
    "Intrigue": [],
    "Seaside": [],
    "Alchemy": [],
    "Prosperity": [],
    "Cornucopia": [],
    "Hinterlands": [],
    "Dark Ages": [],
    "Guilds": [],
    "Adventures": [],
    "Empires": [],
    "2nd": [],
    "Base Cards": []
};

const baseURL = 'http://dominion.diehrstraits.com/';

(async function execute() {
    const sets = Object.keys(jsonPayload);
    for (const set of sets) {
        const htmlString = await fetch(`${baseURL}?set=${set}&f=list`).then((res) => res.text());
        const $ = cheerio.load(htmlString);
        const cards = $('.card-row');

        for (const card of cards.toArray()) {
            const number = $(card).find('.card-number').text();
            const name = $(card).find('.card-name').text();
            //console.log(name);
            const expansion = $(card).find('.card-expansion').text();
            const type = $(card).find('.card-type').text();
            const cost = $(card).find('.card-cost').text();
            const rules = $(card).find('.card-rules').text();

            //pictures
            // const cardPictureRelativeLink = $(card).find('.card-link>.card-img').attr('src');
            // const cardPictureAbsoluteLink = `${baseURL}${cardPictureRelativeLink}`;
            // const pictureResponse = await fetch(cardPictureAbsoluteLink);
            // const dest = fs.createWriteStream(cardPictureRelativeLink);
            // pictureResponse.body.pipe(dest);

            jsonPayload[set] = [...jsonPayload[set], {
                number: number,
                name: name,
                expansion: expansion,
                type: type,
                cost: cost,
                rules: rules,
                //picture: cardPictureRelativeLink
            }];
            // console.log(jsonPayload[set].name)
        }
    }

    console.log(jsonPayload);
    console.log(jsonPayload.Base[0])
    
    const fileContent = jsonPayload;

    const filePath = 'dominion-cards.json';


    fs.writeFile(filePath, JSON.stringify(fileContent), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    } )
})()

