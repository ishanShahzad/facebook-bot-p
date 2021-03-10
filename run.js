const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const axios = require("axios");
const fs = require("fs");
const config = require("./config.json");
const cookies = require("./cookies.json");

puppeteer.use(StealthPlugin());

const fb_run = async (url, id, text) => {
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
    await page.waitFor(3000);
    let currentCookies = await page.cookies();
    fs.writeFileSync("./cookies.json", JSON.stringify(currentCookies));
    await page.goto(
      `https://web.facebook.com/groups/minefunnyvideos/permalink/2229169707227298/`,
      { waitUntil: "networkidle2" }
    );

    let desc = await page.$eval(
      "head > meta[name='description']",
      element => element.content
    );
    let getText = desc;
    if (text.length > 25) {
      text = text.substring(0, 24);
      desc = desc.substring(0, 24);
    }
    browser.close();
    if (desc.trim().includes(text.trim()) || text.trim() == desc.trim()) {
      const resp = await axios.get(
        `http://seedmysite.com/update-job-status.php?id=${id}`
      );
      browser.close();
    } else {
      browser.close();
      return;
    }
  } else {
    //User Already Logged In
    console.log("//User Already Logged In", text);
    await page.setCookie(...cookies);
    await page.goto(`${req.body.url}`, { waitUntil: "networkidle2" });
    const blackList = text.split(/\s+/);
    console.log(blackList);
    const pageContent = await page.$eval("body", el => el.textContent);

    const result = pageContent
      .split(/\s+/)
      .filter(text => blackList.includes(text.toLowerCase()));
    let verifyLen = blackList.length - 5;
    if (result.length < verifyLen) {
      browser.close();
      return;
    } else {
      const resp = await axios.get(
        `http://seedmysite.com/update-job-status.php?id=${id}`
      );
      browser.close();
    }
  }

  //Close Browser
  //await browser.close();
};

setTimeout(() => startNow(), 2 * 60 * 10);

const startNow = async () => {
  let resp = await axios.get("http://seedmysite.com/get-pending-jobs.php");
  let hitNow = resp.data[0];
  // console.log(hitNow);
  let url = hitNow.return_url;
  let id = hitNow.id;
  let text = hitNow.text;
  await fb_run(url, id, text);
};
