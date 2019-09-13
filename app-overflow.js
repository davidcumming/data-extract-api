const querystring = require('querystring');
const https = require('https');
const fs = require('fs')
const path = require('path')

const directoryPath = path.join(__dirname,'Documents')
var parser = require('fast-xml-parser');
var he = require('he');
 
var options = {
    attributeNamePrefix : "@_",
    attrNodeName: "attr", //default is 'false'
    textNodeName : "#text",
    ignoreAttributes : false,
    ignoreNameSpace : false,
    allowBooleanAttributes : false,
    parseNodeValue : true,
    parseAttributeValue : false,
    trimValues: true,
    cdataTagName: "__cdata", //default is 'false'
    cdataPositionChar: "\\c",
    localeRange: "", //To support non english character in tag/attribute values.
    parseTrueNumberOnly: false,
    attrValueProcessor: a => he.decode(a, {isAttributeValue: true}),//default is a=>a
    tagValueProcessor : a => he.decode(a) //default is a=>a
};
 



total_110 = 0
total_120 = 0
total_162 = 0

fs.readdir(directoryPath, function (err, files) {
  //handling error
  if (err) {
      return console.log('Unable to scan directory: ' + err);
  } 
  //listing all files using forEach
  files.forEach(function (file) {
      // Do whatever you want to do with the file
      targetFile = directoryPath + "/" + file
      dataBuffer = fs.readFileSync(targetFile)
      dataXML = dataBuffer.toString()
      
      if( parser.validate(dataXML) === true) { //optional (it'll return an object in case it's not valid)
        jsonObj = parser.parse(dataXML,options);
      }
 
      // Intermediate obj
      tObj = parser.getTraversalObj(dataXML,options);
      jsonObj = parser.convertToJson(tObj,options);
      console.log(jsonObj.Bundle.entry[0].resource.MessageHeader.source.extension[0].valueUri.attr["@_value"])



      

   /*       for (item in data.events) {
  
        eventType=data.events[item].Message[0]["message.taskType"]
        
        if (eventType=="e110-m") {
          total_110++
        } else if (eventType=="e120-m") {
          total_120++
        } else if (eventType=="e162-m") {
          total_162++
        }
      } */

    
  })
  console.log("Total 110: ",total_110)
  console.log("Total 120: ",total_120)
  console.log("Total 162: ",total_162)
})


// Code to call the getJob function on the dataextractAPI - right now I can't get the cert working

/* const directoryPath = path.join(__dirname,'Certificates')
file="preconf_qa1.pem"
targetFile = directoryPath + "/" + file
certString = fs.readFileSync(targetFile,"utf8")
certString = certString.replace(/(\r\n)/gm, "")
console.log(certString)

var postData = querystring.stringify({
  
    "clinicalEventType":"Medication Order - Create",
     "requestType":"eventDetailRecord",
     "encoding":"Clear",
    "pageSize":"500",
    "startDate":"2019-07-01",
    "endDate":"2019-08-03",
    "whitelistedDataElementNames":[ "medicationOrder.id","event.message.profile","message.dateAccepted","message.id","message.taskId","message.jurisdiction","message.version","message.status","message.taskType","medicationOrder.transmissionMethod","application.conformanceVersion","application.id","application.name","application.vendor","sender.facility.id","sender.facility.name","sender.system.type","sender.practitioner.id","receiver.facility.id","receiver.practitioner.id","medicationOrder.requisitionIdentifier","medicationOrder.dateWritten","medicationOrder.prescriber.id","medicationOrder.prescriber.collegeId","medicationOrder.prescriber.firstName","medicationOrder.prescriber.lastName","medicationOrder.category.system","medicationOrder.category.code","medicationOrder.category.text","medicationOrder.drugCode.system","medicationOrder.drugCode.code","medicationOrder.monitoredDrug"],
     "query":"*:*"  

});

var options = {
  hostname: 'api.sharedhealth.exchange',
  path: '/rest/v1/preconf/THP/dataextract_vs1/query',
  method: 'POST',
  headers: {
        'Accept-Encoding': 'gzip,deflate',
        'Content-Type': 'application/json',
        'Authorization': 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdGVzdDEiLCJtYWlsIjoic3RzdGVzdDFAaW5mb3dheS1pbmZvcm91dGUuY2EiLCJvcmciOiJDYW5hZGEgSGVhbHRoIEluZm93YXkiLCJ1c2VyX25hbWUiOiJTdHMgVGVzdDEiLCJpc3MiOiJDYW5hZGEgSGVhbHRoIEluZm93YXkiLCJncm91cHMiOlsiSW5mb3dheSBVc2VycyJdLCJyZWZyZXNoX3Rva2VuIjoiNWVjOWY0MTQtM2NmNS00MDg2LTllZmUtZjg3MWU5MWM2NGViIiwidXNlcl90eXBlIjoiaW50ZXJuYWwiLCJ1c2VyX2lkIjoic3Rlc3QxIiwieHNyZl90b2tlbiI6IjVkZDk2ZGYzLWI5Y2ItNDQ3OS1hN2E4LTQ1Yjg5YmNiZjY2MSIsInNjb3BlIjpbInByZXNjcmliZWl0OmNsZWFyLXRleHQiXSwiZXhwIjoxNTY3NTE0NDM4LCJpYXQiOjE1NTE5NjI0MzgsImp0aSI6IjkzZjAyYjU0LTUzOWYtNDRiNy04ZTdkLWRhYTBhYzg0YWUzZiJ9.EDsRys02-UwX1r4UsPfqsU-MVnZKf86220RRb3xhGMAMjvIhNT0tr1sS4BpeFSThrZtbMhz38OgP-CTeK6v8_LADAiLtBf3SpHoKQ0ha43S5NZKqwU7t3GidMbgRo_djosABavBtm8dnGOISKJUY2NojzoK0v-aPkI3zE6d57ddMCsQJCKnH1AuQtFwZPdXQgMTYivsHnasZR-r_VU0lryM3fqadyjU8Z3-TZxODSm-LNgB2ExP0Dkzy5ZZByYtwjPxpyB3YQN1jOL3EntLdFBbv92fuA7fEHqZtsTlUA1qkiQBZ47gTr0r0UtDsAMDRyAnJMxz8jVhYp88-_CIqYg',
        'X-TELUS-SDF-Developer-Key': 'YjQ3ZTQwMmItYzEyOS00NmUwLTg1MWItODgxNmFiN2NlMTUyOmI0YjM4OWRiZGNhMDQ4ZDI5NDUxOCw0NDVlNjRjYWM0YjYxZjRhZjc5YzI1NGQxY2I2YmI2NmFkN2RiMmJhYzQ=',
        'Content-Length': postData.length,
        'Host': 'api.sharedhealth.exchange',
        'Connection': 'Keep-Alive',
     },
     passphrase: "secret",
     cert: certString


};

var req = https.request(options, (res) => {
  console.log(req)
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.write(postData);
req.end();
 */


 // Code used to parse through a list of JSON files and total the message types

 /* const fs = require('fs')

const path = require('path')

const directoryPath = path.join(__dirname,'Documents')

total_110 = 0
total_120 = 0
total_162 = 0

fs.readdir(directoryPath, function (err, files) {
  //handling error
  if (err) {
      return console.log('Unable to scan directory: ' + err);
  } 
  //listing all files using forEach
  files.forEach(function (file) {
      // Do whatever you want to do with the file
      targetFile = directoryPath + "/" + file
      dataBuffer = fs.readFileSync(targetFile)
      dataJSON = dataBuffer.toString()
      data=JSON.parse(dataJSON)
      


      for (item in data.events) {
  
        eventType=data.events[item].Message[0]["message.taskType"]
        
        if (eventType=="e110-m") {
          total_110++
        } else if (eventType=="e120-m") {
          total_120++
        } else if (eventType=="e162-m") {
          total_162++
        }
      }
  })
  console.log("Total 110: ",total_110)
  console.log("Total 120: ",total_120)
  console.log("Total 162: ",total_162)
}) */



/* const loadEvents = () => {
    try {
        const dataBuffer = fs.readFileSync('DataAPI.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    } catch (e) {
        console.log('Hey')
        return []
    }
}

const data=loadEvents()

total_110 = 0
total_120 = 0
total_162 = 0


for (item in data.events) {
  
  eventType=data.events[item].Message[0]["message.taskType"]
  
  if (eventType=="e110-m") {
    total_110++
  } else if (eventType=="e120-m") {
    total_120++
  } else if (eventType=="e162-m") {
    total_162++
  }
}

console.log(total_110)
console.log(total_120)
console.log(total_162) */

/* const allMessages=[]
const allParticipants=[]
const allMedicationOrders=[]
const allFields=[]

for (item in dataAll.events) {

    currentMessage=dataAll.events[item].Message[0]
    currentParticipants=dataAll.events[item].Participants[0]
    currentMedicationOrders=dataAll.events[item].MedicationOrder[0]
    currentMerged={...currentMessage, ...currentParticipants, ...currentMedicationOrders}
    allFields.push(currentMerged)


}

console.log(allFields)
 */
/* fs.writeFileSync('new.csv',"")

messageAttributes = ['message.dateAccepted',',','message.id',',','message.status',',','message.jurisdiction',',','message.version',',','message.taskId',',','message.taskType',',','medicationOrder.transmissionMethod']

for (item in messageAttributes) {
   
    fs.appendFile('new.csv', data.events[0].Message[0][messageAttributes[item]], (err) => {
        if (err) throw err;
    })

} */

/* const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'out.csv',
  header: [
    {id: 'message.dateAccepted', title: 'message.dateAccepted'},
    {id: 'message.id', title: 'message.id'},
    {id: 'message.status', title: 'message.status'},
    {id: 'message.jurisdiction', title: 'message.jurisdiction'},
    {id: 'message.version', title: 'message.version'},
    {id: 'message.taskId', title: 'message.taskId'},
    {id: 'message.taskType', title: 'message.taskType'},
    {id: 'medicationOrder.transmissionMethod', title: 'medicationOrder.transmissionMethod'},
    {id: 'sender.facility.id', title: 'sender.facility.id'},
    {id: 'sender.facility.name', title: 'sender.facility.name'},
    {id: 'sender.system.type', title: 'sender.system.type'},
    {id: 'sender.practitioner.id', title: 'sender.practitioner.id'},
    {id: 'receiver.facility.id', title: 'receiver.facility.id'},
    {id: 'medicationOrder.id', title: 'medicationOrder.id'},
    {id: 'medicationOrder.requisitionIdentifier', title: 'medicationOrder.requisitionIdentifier'},
    {id: 'medicationOrder.dateWritten', title: 'medicationOrder.dateWritten'},
    {id: 'medicationOrder.prescriber.id', title: 'medicationOrder.prescriber.id'},
    {id: 'medicationOrder.prescriber.collegeId', title: 'medicationOrder.prescriber.collegeId'},
  ]
});

csvWriter
  .writeRecords(allFields)
  .then(()=> console.log('The CSV file was written successfully')); */

