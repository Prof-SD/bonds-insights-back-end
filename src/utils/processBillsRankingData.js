export default function processBillsRankingData (bills, summary = []) {
  let processedData = []
  for (let i = 0; i < bills.length; i++) {
    const transaction = bills[i]
    if (!processedData.find(obj => obj.contract == transaction.contractAddress)) {
      processedData.push({
        initialTokensValue: 0,
        soldPercentage: 0,
        tokensRemaining: 0,
        tokensPurchased: 0,
        contract: transaction.contractAddress,
        lp: transaction.lp,
        token: transaction.payoutToken,
        lpRound: 0,
        tokenRound: 0,
        startTimestamp: 0,
        startDate: '',
        endDate: '',
        duration: '',
        acquiredValue: 0,
        vestedValue: 0,
        vestingTime: transaction.vestingTime,
        ROI: ''
      })
    }
  }

  for (let i = 0; i < processedData.length; i++) {
    const contract = processedData[i].contract
    const timestamps = []
    for (let j = 0; j < bills.length; j++) {
      const transaction = bills[j]
      let timestamp = bills[j].createdAt
      if (transaction.contractAddress == contract) {
        if (String(timestamp).includes(' ')) {
          const date = new Date(timestamp)
          timestamp = Math.floor(date.getTime() / 1000)
        }
        const secondsTimestamp = (String(timestamp).length == 10) ? (timestamp * 1000) : timestamp
        timestamps.push(secondsTimestamp)
        processedData[i].acquiredValue += transaction.dollarValue,
        processedData[i].vestedValue += (transaction.payout * transaction.payoutTokenPrice)
      }
    }
    const startTimestamp = new Date(timestamps[timestamps.indexOf(Math.min(...timestamps.map(timestamp => parseInt(timestamp))))])
    const endTimestamp = new Date(timestamps[timestamps.indexOf(Math.max(...timestamps.map(timestamp => parseInt(timestamp))))])
    processedData[i].startTimestamp = startTimestamp
    processedData[i].startDate = `${startTimestamp.getUTCMonth() + 1}/${startTimestamp.getUTCDate()}/${startTimestamp.getUTCFullYear()}`
    processedData[i].endTimestamp = endTimestamp
    processedData[i].endDate = `${endTimestamp.getUTCMonth() + 1}/${endTimestamp.getUTCDate()}/${endTimestamp.getUTCFullYear()}`
    processedData[i].duration = Math.round((endTimestamp.getTime() - startTimestamp.getTime()) / (86400000))
    processedData[i].ROI = processedData[i].acquiredValue / processedData[i].vestedValue
    processedData[i].acquiredValue = processedData[i].acquiredValue
    processedData[i].vestedValue = processedData[i].vestedValue
  }
  processedData = processedData.filter(bill => bill.acquiredValue > 100 && bill.vestedValue > 100) // Ensures test contracts are ignored
  // Calculates the round number for each lp pair:
  const groupedByLP = []
  for (let i = 0; i < processedData.length; i++) {
    if (!(groupedByLP.find(bill => bill.lp == processedData[i].lp))) {
      groupedByLP.push({
        lp: processedData[i].lp,
        rounds: [
          {
            contract: processedData[i].contract,
            startTimestamp: processedData[i].startTimestamp
          }
        ]
      })
    } else {
      const indexOfLP = groupedByLP.findIndex(obj => obj.lp == processedData[i].lp)
      groupedByLP[indexOfLP].rounds.push({
        contract: processedData[i].contract,
        startTimestamp: processedData[i].startTimestamp
      })
    }
  }
  for (let i = 0; i < groupedByLP.length; i++) {
    groupedByLP[i].rounds.sort((a, b) => (a.startTimestamp > b.startTimestamp) ? 1 : -1)
  }
  for (let i = 0; i < processedData.length; i++) {
    for (let j = 0; j < groupedByLP.length; j++) {
      if (processedData[i].lp == groupedByLP[j].lp) {
        const lpRound = groupedByLP[j].rounds.findIndex(obj => obj.contract == processedData[i].contract) + 1
        processedData[i].lpRound = lpRound
      }
    }
  }
  // Calculates the round number for each token:
  const groupedByToken = []
  for (let i = 0; i < processedData.length; i++) {
    if (!(groupedByToken.find(bill => bill.token == processedData[i].token))) {
      groupedByToken.push({
        token: processedData[i].token,
        rounds: [
          {
            contract: processedData[i].contract,
            startTimestamp: processedData[i].startTimestamp
          }
        ]
      })
    } else {
      const indexOfToken = groupedByToken.findIndex(obj => obj.token == processedData[i].token)
      groupedByToken[indexOfToken].rounds.push({
        contract: processedData[i].contract,
        startTimestamp: processedData[i].startTimestamp
      })
    }
  }
  for (let i = 0; i < groupedByToken.length; i++) {
    groupedByToken[i].rounds.sort((a, b) => (a.startTimestamp > b.startTimestamp) ? 1 : -1)
  }
  for (let i = 0; i < processedData.length; i++) {
    for (let j = 0; j < groupedByToken.length; j++) {
      if (processedData[i].token == groupedByToken[j].token) {
        const tokenRound = groupedByToken[j].rounds.findIndex(obj => obj.contract == processedData[i].contract) + 1
        processedData[i].tokenRound = tokenRound
      }
    }
  }

  // Assigns summary's selling progress, bond type, and lp type into the processedData summary:
  for (let i = 0; i < processedData.length; i++) {
    for (let j = 0; j < summary.length; j++) {
      if (processedData[i].contract == summary[j].contract) {
        processedData[i].tokensRemaining = summary[j].tokensRemaining
        processedData[i].tokensPurchased = summary[j].tokensPurchased
        processedData[i].soldPercentage = summary[j].soldPercentage
        processedData[i].type = summary[j].type
        processedData[i].lpType = summary[j].lpType
      }
    }
  }

  // Assigns initial tokens value into the processedData summary:
  for (let i = 0; i < processedData.length; i++) {
    let trial = 0
    for (let j = 0; j < bills.length; j++) {
      if (processedData[i].contract == bills[j].contractAddress) {
        const initialTokens = processedData[i].tokensRemaining + processedData[i].tokensPurchased
        processedData[i].initialTokensValue = bills[j].payoutTokenPrice * initialTokens
        if (processedData[i].initialTokensValue > 100) { break }
        trial++
        if (trial === 3) { break }
      }
    }
  }

  return processedData
}
