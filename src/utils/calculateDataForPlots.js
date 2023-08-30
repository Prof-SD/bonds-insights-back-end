export default function calculateDataForPlots (data) {
  // Getting the complete array of timestamps: from all transactions:
  const timestamps = []
  for (let i = 0; i < data?.length; i++) {
    let timestamp = data[i].createdAt
    if (String(timestamp).includes(' ')) {
      const date = new Date(timestamp)
      timestamp = Math.floor(date.getTime() / 1000)
    }
    const miliSecondsTimestamp = (String(timestamp).length == 10) ? (timestamp * 1000) : timestamp
    timestamps.push(miliSecondsTimestamp)
  }

  // Obtaining the number of days since Bills' sales started untill today:
  const minDate = (Math.floor(Math.min(parseInt(timestamps)) / 86400000)) * 86400000
  const now = Math.ceil(Date.now() / 86400000) * 86400000

  const elapsedTime = now - minDate
  const daysPassed = elapsedTime / 86400000

  // Declaring Arrays to fill over the cycles:
  const dailyDates = [] // For all plots
  const dailyAccumWallets = [] // For 1st plot
  const dailyWallets = [] // For 2nd plot
  const dailyAccumNumBills = [] // For 3rd plot
  const dailyNumBills = [] // For 4th plot
  const dailyAccumDollarAcquiredValue = [] // For 5th plot
  const dailyDollarAcquiredValue = [] // For 6th plot
  const dailyAccumDollarVestedValue = [] // For 7th plot
  const dailyDollarVestedValue = [] // For 8th plot
  const dailyOverallRoi = [] // For 9th plot

  // Declaring initial values for incremental ACCUMULATED variables:
  let incrementalTime = minDate // For all plots
  let accumWalletsCount = 0 // For 1st plot
  let accumBillsCount = 0 // For 3rd plot
  let accumDollarAcquiredValue = 0 // For 5th plot
  let accumDollarVestedValue = 0 // For 7th plot

  // Declaring wallets 'lifetime counted' array to avoid counting repetition:
  const walletsCounted = []

  // Looping over the number of days passed until now (since bills sales begun):
  for (let i = 0; i < daysPassed; i++) {
    // Filling the dailyDates array with formatted date strings:
    dailyDates.push(new Date(incrementalTime).toISOString())
    // Declaring wallets 'daily counted' array to avoid in-day counting repetition:
    const dailyWalletsCounted = []
    // Declaring initial values for incremental DAILY variables:
    let dayWalletsCount = 0 // For 2nd plot
    let dayBillsCount = 0 // For 4th plot
    let dayAcquiredValue = 0 // For 6th plot
    let dayVestedValue = 0 // For 8th plot
    // Looping over the length of the transactions array:
    for (let j = 0; j < data.length; j++) {
      // Unifying formats for transactions' timestamps:
      let timestamp = data[j].createdAt
      if (String(timestamp).includes(' ')) {
        const date = new Date(timestamp)
        timestamp = Math.floor(date.getTime() / 1000)
      }
      const miliSecondsTimestamp = (String(timestamp).length == 10) ? (timestamp * 1000) : timestamp
      // If transaction occured during the current day:
      if (miliSecondsTimestamp >= (incrementalTime) && miliSecondsTimestamp < (incrementalTime + 86400000)) {
        accumBillsCount++
        dayBillsCount++
        accumDollarAcquiredValue += data[j].dollarValue
        dayAcquiredValue += data[j].dollarValue
        accumDollarVestedValue += data[j].payout * data[j].payoutTokenPrice
        dayVestedValue += data[j].payout * data[j].payoutTokenPrice
        // If wallet has not been seen in lifetime:
        if (!walletsCounted.find(wallet => wallet == data[j].createdAddressOwner)) {
          accumWalletsCount++
          walletsCounted.push(data[j].createdAddressOwner)
        }
        // If wallet has not been seen during this day:
        if (!dailyWalletsCounted.find(wallet => wallet == data[j].createdAddressOwner)) {
          dayWalletsCount++
          dailyWalletsCounted.push(data[j].createdAddressOwner)
        }
      }
    }
    // After each day loop, time to push to the corresponding array:
    dailyAccumWallets.push(accumWalletsCount) // For 1st Plot
    dailyWallets.push(dayWalletsCount) // For 2nd Plot
    dailyAccumNumBills.push(accumBillsCount) // For 3rd Plot
    dailyNumBills.push(dayBillsCount) // For 4th Plot
    dailyAccumDollarAcquiredValue.push(accumDollarAcquiredValue) // For 5th Plot
    dailyDollarAcquiredValue.push(dayAcquiredValue) // For 6th Plot
    dailyAccumDollarVestedValue.push(accumDollarVestedValue) // For 7th Plot
    dailyDollarVestedValue.push(dayVestedValue)
    // Computing the day ROI and pushing it to the series:
    const dayRoi = dayAcquiredValue / dayVestedValue * 100
    dailyOverallRoi.push(dayRoi)
    // Increments a day to the timestamp counter:
    incrementalTime += 86400000
  }
  // Computing Average Overall ROI:
  const averageOverallRoi = (dailyAccumDollarAcquiredValue[dailyAccumDollarAcquiredValue.length - 1] / dailyAccumDollarVestedValue[dailyAccumDollarVestedValue.length - 1] * 100).toFixed(2)

  return {
    dailyDates,
    dailyAccumWallets,
    dailyWallets,
    dailyAccumNumBills,
    dailyNumBills,
    dailyAccumDollarAcquiredValue,
    dailyDollarAcquiredValue,
    dailyAccumDollarVestedValue,
    dailyDollarVestedValue,
    dailyOverallRoi,
    averageOverallRoi
  }
}
