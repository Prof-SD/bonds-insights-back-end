import processBillsRankingData from './processBillsRankingData.js'

function shallowCompare (obj1, obj2) {
  if (Object.keys(obj1).length === Object.keys(obj2).length && Object.keys(obj1).every(key => obj1[key] === obj2[key])) {
    return true
  }
}

export async function getBills (data) {
  let json = data.purchases

  // Filtering out faulty transactions

  const completeTransactions = []
  for (let i = 0; i < json.length; i++) {
    if (Object.keys(json[i]).length == 12) {
      completeTransactions.push(json[i])
    }
  }

  json = completeTransactions

  // Making lowercase all contracts' addresses
  for (let i = 0; i < json.length; i++) {
    json[i].contractAddress = json[i].contractAddress?.toLowerCase()
    json[i].createdAddressOwner = json[i].createdAddressOwner?.toLowerCase()
  }

  // Making uppercase lp and payoutToken
  for (let i = 0; i < json.length; i++) {
    json[i].lp = json[i].lp.toUpperCase()
    json[i].payoutToken = json[i].payoutToken.toUpperCase()
  }
  // Removing duplicate transactions - Just in case, since sometimes the api brings duplicates
  const uniqueTransactions = []
  for (let i = 0; i < json.length; i++) {
    if (!uniqueTransactions.find(transaction => shallowCompare(transaction, json[i]))) {
      uniqueTransactions.push(json[i])
    }
  }
  // Filtering out bills with more than 7 days "end date / last purchase" from now, and < 1k acquired value and < 5 days of duration
  const processedBills = processBillsRankingData(uniqueTransactions)
  const contractsToFilter = []
  for (let i = 0; i < processedBills.length; i++) {
    let timestamp = processedBills[i].endTimestamp
    if (String(timestamp).includes(' ')) {
      const date = new Date(timestamp)
      timestamp = Math.floor(date.getTime() / 1000)
    }
    const secondsTimestamp = (String(timestamp).length == 10) ? (timestamp * 1000) : timestamp
    if (secondsTimestamp < (Date.now() - 7 * 86400000)) {
      if (processedBills[i].acquiredValue < 1000 || processedBills[i].duration < 5) {
        contractsToFilter.push(processedBills[i].contract)
      }
    }
  }
  const uniqueLegitTransactions = []
  for (let i = 0; i < uniqueTransactions.length; i++) {
    if (!contractsToFilter.find(contract => contract == uniqueTransactions[i].contractAddress)) {
      uniqueLegitTransactions.push(uniqueTransactions[i])
    }
  }
  return uniqueLegitTransactions
}
