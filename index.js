const puppeteer = require("puppeteer")
const express = require("express")
require("dotenv").config()

const app = express()

app.get("/",(req,res)=>{
 
    const {id} = req.query

     getfollowers= async()=>{
        let {followers,connections} = await run(id)
        console.log(followers,connections)
        if(followers!==""){
            res.send({
                followers,
                connections
            })
        }else{
            res.send("error")
        }
       

    }
    getfollowers()
   
    
    
})


app.listen(process.env.PORT,()=>{
    console.log("Server is running on",process.env.PORT)
})

async function run(id){

    //open browser
    const browser = await puppeteer.launch()
    //open new tab
    const page = await browser.newPage()
    //enter url
    await page.goto(`https://www.linkedin.com/in/${id}`)
    //wait for navigation to complete
    await page.waitForNavigation({waitUntil: 'networkidle0'})
    //take a screen shot after load and save it as example.png
    const textContentArray = await page.$$eval("span.top-card__subline-item", elements =>
    elements.map(element => element.textContent)
  );

  let followers =textContentArray[0].split("\n")[1].trim()
  let connections = textContentArray[1].trim()
  
    //close the browser
    await browser.close()

  return {followers,connections}

   

}


