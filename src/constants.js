const APIS = {
  PROD: 'https://api.ape.bond/bills/summary',
  STAGE: 'https://staging-api.ape.bond/bills/summary'
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
