const puppeteer = require('puppeteer');

test('Adds two number', () => {
   const sum = 1 + 1;
   expect(sum).toEqual(2);
});

test('launch a brwoer', async () => {
   const browser = await puppeteer.launch({
      headless: false
   });
   const page = await browser.newPage();
});