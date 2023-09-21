const express = require("express")
const  app = express()
const bodyP = require("body-parser")

require('dotenv').config(); 
const port = process.env.PORT || 8000;
const ctid = process.env.IDC;
const ctsk = process.env.SKC;

console.log(__dirname)


app.use(bodyP.json())
app.use("/codemirror-5.65.14", express.static("codemirror-5.65.14"))
app.use("/styles", express.static("styles"));
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html")
    console.log("at line 18")
})



app.post("/compile", function(req, res) {
    console.log("inside post block")

   var code=req.body.code
   var input=req.body.input
   var lang=req.body.lang
   if(lang == "no-lang") {
    res.send({output: "Please select a language first!"})
   }
   console.log('Code:', code);
   console.log('Input:', input);
   console.log('Language:', lang);


   var request = require('request');

var program = {
    script : code,
    stdin: input,
    language: lang,
    get versionIndex() {
        if (this.language === "python3") {
            return "4";
        } else if (this.language === "java") {
            return "4";
        } else if (this.language === "cpp17") {
            return "1";
        } else {
            return "4";
        }
    },
    clientId: ctid,
    clientSecret: ctsk
};
request({
    url: 'https://api.jdoodle.com/v1/execute',
    method: "POST",
    json: program
},
function (error, response, body) {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);
    console.log(body.output)
    if(response && response.statusCode === "401") {
        res.send({output: "An error occured! Error code (101). Please try again later"})
    } else if (response && response.statusCode === "429") {
        res.send({output: "An error occured! Error code (105). Please try again later"})
    } else {
        res.send(body)
    }


    
})
 
})



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});