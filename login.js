// const sleep = async (ms) => {
//   return new Promise((res, rej) => {
//     setTimeout(() => {
//       res();
//     }, ms)
//   });
// }

// const ID = {
//   login: '#email',
//   pass: '#pass'
// };

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     args: ['--no-sandbox', '--disable-setuid-sandbox']
//   });
//   const page = await browser.newPage();
//   let login = async () => {
//     // login
//     await page.goto('https://facebook.com', {
//       waitUntil: 'networkidle2'
//     });
//     await page.waitForSelector(ID.login);
//     console.log(CRED.user);
//     console.log(ID.login);
//     await page.type(ID.login, CRED.user);

//     await page.type(ID.pass, CRED.pass);
//     await sleep(500);

//     await page.click("#loginbutton")

//     console.log("login done");
//     await page.waitForNavigation();
//   }
//   await login();

const puppeteer = require("puppeteer");
const fs = require("fs");
const config = require("./config.json");
const cookies = require("./cookies.json");

(async () => {
  console.log("Hello World");
  //insert code here

  let browser = await puppeteer.launch({ headless: false });
  const context = browser.defaultBrowserContext();
  context.overridePermissions("https://www.facebook.com", []);
  let page = await browser.newPage();
  await page.setDefaultNavigationTimeout(100000);
  await page.setViewport({ width: 1200, height: 800 });

  if (!Object.keys(cookies).length) {
    await page.goto("https://www.facebook.com/login", {
      waitUntil: "networkidle2"
    });
    await page.type("#email", config.username, { delay: 30 });
    await page.type("#pass", config.password, { delay: 30 });
    await page.click("#loginbutton");
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    await page.waitFor(15000);
    // try {
    //   await page.waitFor('[data-click="profile_icon"]');
    // } catch (err) {
    //   console.log("failed to login");
    //   process.exit(0);
    // }
    let currentCookies = await page.cookies();
    fs.writeFileSync("./cookies.json", JSON.stringify(currentCookies));
  } else {
    //User Already Logged In
    await page.setCookie(...cookies);
    await page.goto("https://www.facebook.com/", { waitUntil: "networkidle2" });
  }

  //Close Browser
  //await browser.close();
})();
