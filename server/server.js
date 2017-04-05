const express = require("express");
const path = require('path');

const app = express();

app.set('port', (process.env.PORT || 8080));

app.use(express.static(path.join(__dirname, '../build')));

app.listen(app.get('port'), function(){
    console.log("Started listening on port", app.get('port'));
});