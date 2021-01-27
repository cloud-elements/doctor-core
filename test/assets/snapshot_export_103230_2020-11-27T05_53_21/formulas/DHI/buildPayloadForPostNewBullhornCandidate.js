// Handle: 
// object for candidatesVDR
// array for candidateWorkHistoryVDR
// array for candidateEducationVDR


let diceProfileObj = steps.getUnlinkedDiceProfileById.response.body;

if (diceProfileObj.hasOwnProperty("employmentType")) {
// Building candidate object from dice profile
let {employmentType} = diceProfileObj;
const {epFullTime, epContractCorpToCorp, epContractW2, epContractToHireW2, epContract1099, epContractToHire1099, epContractToHireCorpToCorp, epPartTime} = config;

const employmentTypeMap = {
  "full-time": epFullTime,
  "contract - corp-to-corp": epContractCorpToCorp,
  "contract - w2": epContractW2,
  "contract to hire - w2": epContractToHireW2,
  "contract - independent": epContract1099,
  "contract to hire - independent": epContractToHire1099,
  "contract to hire - corp-to-corp": epContractToHireCorpToCorp,
  "part-time": epPartTime
}

let newConvertedEmployeeType;

Object.keys(employmentTypeMap).forEach(key => {
  if (key.includes(employmentType[0].toLowerCase())) {
    newConvertedEmployeeType = employmentTypeMap[key]
  }
})

diceProfileObj.employmentType = newConvertedEmployeeType;
}

done({ diceProfileObj });