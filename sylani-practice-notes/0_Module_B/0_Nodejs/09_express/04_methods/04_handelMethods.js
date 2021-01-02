const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('port', process.env.PORT || 3000);

// app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// GET
app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname });
    // res.json(req.query); // try: localhost:3000/?email=abc@example.com&pwd=12345
});

// POST
app.post('/user', (req, res) => {
    console.log('req.body', req.body)
    res.end(JSON.stringify(req.body));
});

// app.put
// app.delete


app.listen(app.get('port'), function () {
    console.log(`Express Started on: http://localhost:${app.get('port')}`);
});