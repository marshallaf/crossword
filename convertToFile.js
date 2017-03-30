const fs = require('fs');
const xml2js = require('xml2js');
const jsonfile = require('jsonfile');

const parser = new xml2js.Parser({mergeAttrs: true, explicitArray: false});
const crosswordXml = fs.readFileSync('testcrossword.xml').toString();
parser.parseString(crosswordXml, (err, result) => {
  fs.open('testcrossword3.json', 'wx', (err, file) => {
    if (err) {
      if (err.code === 'EEXIST') {
        console.error('the file already exists');
        return;
      } else {
        throw err;
      }
    }

    jsonfile.writeFile(file, result, {spaces: 2}, (err) => console.log(err));
  });
});