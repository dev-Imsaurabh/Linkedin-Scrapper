const puppeteer = require("puppeteer");
const express = require("express");
require("dotenv").config();
let port = process.env.PORT || 4000;

const app = express();

app.get("/", (req, res) => {
  res.send({
    message: "Running",
  });
});

app.get("/:id", (req, res) => {
  const { id } = req.params;

  getfollowers = async () => {
    let { followers, connections } = await run(id);
    console.log(followers, connections);
    res.send({
      followers,
      connections,
    });
  };
  getfollowers();
});

app.listen(port, () => {
  console.log("Server is running on", port);
});

async function run(id) {
  //open browser
  const browser = await puppeteer.launch();

  //  {
  //   headless: true,
  //   args: ['--no-sandbox', '--disable-setuid-sandbox'],
  // }

  //open new tab
  const page = await browser.newPage();
  //enter url
  await page.goto(`https://www.linkedin.com/in/${id}`);

  //wait for navigation to complete
  await page.waitForNavigation({ waitUntil: "networkidle0" });

  //take a screen shot after load and save it as example.png
  try {
    
    const textContentArray = await page.$$eval(
      "span.top-card__subline-item",
      (elements) => elements.map((element) => element.textContent)
    );
  
    let followers = textContentArray[0].split("\n")[1].trim();
    
    let connections = textContentArray[1].trim();
    
  //close the browser
  await browser.close();

  return { followers, connections };
  } catch (error) {

  //close the browser
  await browser.close();

  return { followers:null, connections:null };
    
  }


}
