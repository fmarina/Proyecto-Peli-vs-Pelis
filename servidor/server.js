const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
const routes     = require('./config/routes');
const app = express();
const port = 8080;

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

routes(app);

app.listen(port, () => {
    console.log(`server is listening on ${port}`)
})  