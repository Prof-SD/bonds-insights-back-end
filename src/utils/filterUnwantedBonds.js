import { UNWANTED_BONDS } from '../constants.js'

export const filterUnwantedBonds = (data) => {
  // Filter out purchases containing a contractAddress equal to any of the UNWANTED_BONDS and also filter out summary containing a contract equal to any of the UNWANTED_BONDS
  let purchases = data?.purchases
  let summary = data?.summary

  if (UNWANTED_BONDS.length > 0) {
    purchases = data?.purchases?.filter((purchase) => !UNWANTED_BONDS.includes(purchase?.contractAddress?.toLowerCase()))
    summary = data?.summary?.filter((summary) => !UNWANTED_BONDS.includes(summary?.contract?.toLowerCase()))
  }

  const filteredData = {
    purchases,
    summary
  }

  return (filteredData)
}

/*
data = {
  "purchases": [{}...{}]
  "summary": [{}...{}]
}
*/
