const jobOrder = steps.getJobOrderById.response.body
const searchType = config.searchType
const hasEmail = config.hasEmail
const hasPhoneNumber = config.hasPhoneNumber
const excludeThirdParty = config.excludeThirdParty
const pageSize = config.intelliSearchPageSize
const {etFullTime, etContractCorpToCorp, etContractW2, etContractToHireW2, etContract1099, etContractToHire1099, etContractToHireCorpToCorp, etPartTime} = config;

if(jobOrder.hasOwnProperty("employmentType")){
const employmentTypeMap = {
  "full-time": etFullTime,
  "contract - corp-to-corp": etContractCorpToCorp,
  "contract - w2": etContractW2,
  "contract to hire - w2": etContractToHireW2,
  "contract - independent": etContract1099,
  "contract to hire - independent": etContractToHire1099,
  "contract to hire - corp-to-corp": etContractToHireCorpToCorp,
  "part-time": etPartTime
}

const bullhornET = jobOrder.employmentType;
let employmentTypeArray = [];

Object.keys(employmentTypeMap).forEach(key => {
  if (employmentTypeMap[key] == bullhornET) {
    employmentTypeArray.push(key)
  }
})

jobOrder["employmentType"] = employmentTypeArray.join(", ");
}
done(Object.assign(jobOrder, {searchType, hasEmail, hasPhoneNumber, excludeThirdParty, pageSize}))