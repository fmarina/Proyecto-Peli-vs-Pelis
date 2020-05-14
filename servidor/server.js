const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`server is listening on ${port}`)
})  