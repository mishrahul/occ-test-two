const express = require("express")
const  app = express()
const bodyP = require("body-parser")
// const compiler = require("compilex")
// const options = { stats: true }
// const currentTime = new Date().toLocaleTimeString();
require('dotenv').config(); // Load environment variables from .env file
const port = process.env.PORT || 8000;
const ctid = process.env.IDC;
const ctsk = process.env.SKC;



// compiler.init(options)
app.use(bodyP.json())
app.use("/codemirror-5.65.14", express.static("codemirror-5.65.14"))
app.use("/styles", express.static("styles"));
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html")
})


app.post("/compile", function(req, res) {
   var code=req.body.code
   var input=req.body.input
   var lang=req.body.lang

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
 
/*   
   try{
        if(lang=="no-lang") {
            res.send({output:"No language selected!"})
        }
        if(lang=="CPP") {
            if(!input) {
                var envData = { OS : "windows" , cmd : "g++", options:{timeout:10000}}; // (uses g++ command to compile)
                compiler.compileCPP(envData , code , function (data) {
                    if(data.output) {
                    res.send(data);
                    }
                    else {
                    res.send({output:"An error occured"})
                    }
        
                });
            } 
            else{
                var envData = { OS : "windows" , cmd : "g++", options:{timeout:10000}}; // (uses g++ command to compile )
                compiler.compileCPPWithInput(envData , code , input , function (data) {
                    if(data.output) {
                    res.send(data);
                    }
                    else {
                    res.send({output:"An error occured"})
                    }
                });
            }
        }
        else if(lang=="Java") {
            if(!input) {
                var envData = { OS : "windows"}; 
                compiler.compileJava( envData , code , function(data){
                    if(data.output) {
                    res.send(data);
                    }
                    else {
                        res.send({output:"An error occured"})
                    }
                });    
            }
            else {
                var envData = { OS : "windows"}; 
                compiler.compileJavaWithInput( envData , code , input ,  function(data){
                    if(data.output) {
                    res.send(data);
                    }
                    else {
                        res.send({output:"An error occured"})
                    }
                });
            }
        }
        else if(lang=="Python") {
            if(!input) {
                var envData = { OS : "windows"}; 
                compiler.compilePython( envData , code , function(data){
                    if(data.output) {
                    res.send(data);
                    }
                    else {
                        res.send({output:"An error occured"})
                    }
                });
            }
            else {
                var envData = { OS : "windows"}; 
                compiler.compilePythonWithInput( envData , code , input ,  function(data){
                    if(data.output) {
                    res.send(data);
                    }
                    else {
                        res.send({output:"An error occured"})
                    }        
                });
            } 
        }
    }
   
   catch(e) {
        console.log("error at catch")
    }
*/
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});