const fs = require('fs');

let rawdata = fs.readFileSync('./documents/other.json');
let requests = JSON.parse(rawdata);

var everything = []

for (item in requests.everything) {
  current = {
    name : requests.everything[item].organizationName,
    fax : requests.everything[item].phone.faxNumber
  }
  everything.push(current)
}



const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'faxnums.csv',
    header: [
        {id: 'name', title: 'NAME'},
        {id: 'fax', title: 'FAX'}
    ]
});
 

 
csvWriter.writeRecords(everything)       // returns a promise
    .then(() => {
        console.log('...Done');
    });