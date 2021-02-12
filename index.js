import express from 'express';
import favicon from 'serve-favicon';
import path from 'path';
import data from './data/data.json';

const app = express();

const PORT = 3000;

app.use(express.static('public'));

//loades images from image folder with url /images/*
app.use('/images', express.static('images'));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//method to use json
//app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//this is for proxies
app.set("trust proxy", "loopback");

app.get("/", (req, res) => {
    res.json(data);
});



app.get("/item/:id", (req, res, next) => {
    //this is the middleware that pulls the data
    let userID = Number(req.params.id);
    //middleware that uses the req object
    console.log(`Request from: ${req.originalUrl}`);
    console.log(`Request type: ${req.method}`);
    res.send(data[userID - 1]);
    next();
}, (req, res) =>
    console.log("Did you get the right data?")
);

app.post("/newItem", (req, res) => {
    res.send(req.body);
});


app.route('/item').
    get((req, res) => {
        throw new Error();
    }).put((req, res) => {
        res.send(`Put Request from ${PORT}`);
    }).delete((req, res) => {
        res.send(`Delete Request from ${PORT}`);
    });


//Error handling function
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`Alert: ${err.stack}`);
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});