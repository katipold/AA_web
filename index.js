const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const dateEt = require("./src/dateTimeET");
const textRef = "public/txt/vanasonad.txt";
//loome rakenduse, mis käivitab express raamistiku
const app = express();
//määran lehtede renderdaja(view engine)
app.set("view engine", "ejs");
//muudame public kataloogi veebiserverile kättesaadavaks
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extend: false}));

app.get("/", (req, res)=>{
	//res.send("Express.js rakendus läkski käima!");
	res.render("index");
});

app.get("/timenow", (req, res)=>{
	res.render("timenow", {wd: dateET.weekDay(), date: dateET.Longdate()});
});

app.get("/vanasonad", (req, res) => {
    fs.readFile(textRef, "utf8", (err, data) => {
        if (err) {
            res.render("genericlist", {
                h2: "Vanasõnad",
                listData: ["Vabandame, ühtegi vanasõna ei leitud!"]
            });
        } else {
            res.render("genericlist", {
                h2: "Vanasõnad",
                listData: data.split(":")  // Kui andmed on jaotatud näiteks semikoolonitega, siis split töötab
            });
        }
    });
});

app.get("/reqvisit", (req, res)=>{
	res.render("reqvisit");
});

app.post("/reqvisit", (req, res)=>{
	console.log(req.body)
	//avan tekstifaili kirjutamiseks sellisel moel, et kui teda pole, luuakse (parameeter "a")
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
		if(err){
			throw(err);
		}
		else {
			//faili senisele sisule lisamine
			fs.appendFile("public/txt/visitlog.txt", req.body.nameInput + ";", (err)=>{
				if(err){
					throw(err);
				}
				else {
					console.log("Salvestatud!");
					res.render("regvisit");
				}
			});
		}
	});
});

app.listen(5326);