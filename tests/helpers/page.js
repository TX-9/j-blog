const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
    static async build() {
        const browser = await puppeteer.launch({
            headless: false
        });

        const page = await browser.newPage();
        const customPage = new CustomPage(page);

        return new Proxy(customPage, {
            get: function (target, property) {
                return customPage[property] || browser[property] || page[property];
            }
        })
    }

    constructor(page) {
        this.page = page;
    }

    async login() {
        const user = await userFactory();
        const { session, sig } = sessionFactory(user);

        console.log(session, sig);

        await this.page.setCookie({name: 'session', value: session});
        await this.page.setCookie({name: 'session.sig', value: sig});
        await this.page.goto('localhost:3000/blogs');
        await this.page.waitFor('a[href="/auth/logout');

    }

    async function getCotentsOf(query) {
        const text = await page.$eval(query, el => el.innerHTML);
        return text;
    }
}

module.exports = CustomPage;
