
// Code used to parse through a list of JSON files and total the message types

const fs = require('fs')
const path = require('path')
const directoryPath = path.join(__dirname, 'Documents')

prefixCPRID = "http://sharedhealth.exchange/fhir/NamingSystem/registry-id-organization|"

listCPRID = new Map()

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
        currentCPRID = data.events[item].Participants[0]["receiver.facility.id"]
        currentMessageID = data.events[item].Message[0]["medicationOrder.id"]
        currentList = listCPRID.get(currentCPRID)
        j = typeof currentList
        console.log(j)
        if (currentList==undefined) {
          console.log("one")
          tempList = []
          tempList.push(currentMessageID)
          listCPRID.set(currentCPRID, tempList)
        } else {
          console.log("two")
        }


      }
    }

  })

  listCPRID.forEach((value, key, map) => {
    console.log(key, " | ", value.length)
  })

})
