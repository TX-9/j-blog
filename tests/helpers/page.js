const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
    static async build() {
        const browser = await puppeteer.launch({
            //headless: true,
            headless: false,
            args: ['--no-sandbox'] // decrease running time in virtual machine
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
        await this.page.goto('http://localhost:3000/blogs');
        // comment out because logout button does not show up
        await this.page.waitFor('a[href="/auth/logout"]');
    }

    async getContentsOf(query) {
        // const text = await this.page.$eval(query, el => el.innerHTML);
        // return text;
        return this.page.$eval(query, el => el.innerHTML);
    }

    get(path) {
         return this.page.evaluate((_path) => {
            return fetch(_path, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json());
        }, path);
    }

    post(path, data) {
        return this.page.evaluate(
            (_path, _data) => {
                return fetch(_path, {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(_data)
                }).then(res => res.json());
            }, path, data);
    }

    execRequests(actions) {
        return Promise.all(
            // Array of Promise
            actions.map(({ method, path, data }) => {
                // this is reference to current page.js
               return this[method](path, data);
            })
        );
    }
}

module.exports = CustomPage;

