const APIS = {
  PROD: 'https://api-v2.apeswap.finance/bills/summary',
  STAGE: 'https://apeswap-api-v2-pr-75.herokuapp.com/bills/summary'
}

const CURRENT_API = APIS.PROD

const MINUTES = 60

// Include bonds contract addresses to filter them out
const UNWANTED_BONDS = []

export {
  CURRENT_API,
  MINUTES,
  UNWANTED_BONDS
}
