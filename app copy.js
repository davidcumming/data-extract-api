
// Code used to parse through a list of JSON files and total the message types

const fs = require('fs')
const path = require('path')
const directoryPath = path.join(__dirname, 'Documents')

total_110 = 0
total_120 = 0
total_162 = 0
total_163 = 0
listOfOrgs = []
prefixCPRID = "http://sharedhealth.exchange/fhir/NamingSystem/registry-id-organization|"

const CPRIDTotals = new Map()
const listCPRID = new Map()

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
    data = JSON.parse(dataJSON)

    for (item in data.events) {

      if (data.events[item].Message[0]["message.status"] == 'ACKNOWLEDGED') {
        eventType = data.events[item].Message[0]["message.taskType"]
        // ConcOrg = data.events[item].Participants[0]["sender.facility.name"]+'||'+data.events[item].Application[0]["application.vendor"]+'||'+data.events[item].Participants[0]["sender.facility.id"]+'||'+data.events[item].Participants[0]["receiver.facility.id"]
        // listOfOrgs.push(ConcOrg)
        currentCPRID = data.events[item].Participants[0]["receiver.facility.id"]
        if (listCPRID.has(currentCPRID)) {
          x1 = listCPRID.get(currentCPRID)
          if (x1.has(eventType)) {
            t2 = x1.get(eventType)
            t2++
            x1.delete(eventType)
            x1.set(eventType, t2)
          } else {
            x2 = listCPRID.get(currentCPRID)
            x2.set(eventType, 1)
          }
        } else {
          t1 = new Map()
          t1.set(eventType, 1)
          listCPRID.set(currentCPRID, t1)
        }

        /*       if (data.events[item].Participants[0]["sender.facility.id"]=="http://sharedhealth.exchange/fhir/NamingSystem/registry-id-organization|200114534") {
                if (data.events[item].Message[0]["message.status"]=="ACKNOWLEDGED") {
                  if (eventType == "e110-m") {
                    total_110++
                  } else if (eventType == "e120-m") {
                    total_120++
                  } else if (eventType == "e162-m") {
                    total_162++
                  } else if (eventType == "e163-m") {
                    total_163++
                  }
                } 
             
              } */


      }
    }
    /*     CPRIDPrint = ["190010012","190010018","190010019","190010057","190010062","190010071","190010148","191000007","200052024","200114534","200117026"]
        for (i in CPRIDPrint) {
          isearch = prefixCPRID + CPRIDPrint[i]
          console.log(listCPRID.get(isearch))
        } */
  })


  console.log(listCPRID)

  /* console.log("Total 110: ", total_110)
  console.log("Total 120: ", total_120)
  console.log("Total 162: ", total_162)
  console.log("Total 163: ", total_163) */
  cleanOrgList = []



  cleanOrgList = listOfOrgs.filter(function (item, pos, self) {
    return self.indexOf(item) == pos;
  })





})
