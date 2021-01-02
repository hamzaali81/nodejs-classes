const express = require('express');

const app = express();

const router1 = express.Router();
const router2 = express.Router();
const router3 = express.Router();

router1.get('/', (req, res) => res.send('API is Live!'));
router1.get('/user', (req, res) => res.send('/user calling'));
router1.get('/group', (req, res) => res.send('/group calling'));
router1.get('/post', (req, res) => res.send('/post calling'));

router2.get('/:username', (req, res) => res.send(JSON.stringify(req.params)));

router3.get('/', (req, res) => res.send('API is Live Updated ......!'))

app.use('/apiV1', router1);
app.use('/apiV2', router3);
app.use('/users', router2);


app.get('/', function (req, res) {
    res.send('Express Works');
});

app.listen(3000, function () {
    console.log(`Express Server Started on: http://localhost:3000`);
});