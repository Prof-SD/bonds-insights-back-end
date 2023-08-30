// This service is created to depaginate the data from the API
import axios from 'axios'
import { CURRENT_API } from '../constants.js'

export const dataComposer = async () => {
  try {
    const transactionsData = []
    let page = 1
    let totalPages
    let failedFetches = 0

    do {
      if (failedFetches > 10) {
        throw new Error('Too many failed fetches - aborting dataComposer! - Check the API! - Will wait for next scheduled fetch!')
      }

      setTimeout(() => {}, 100)

      const response = await axios.get(`${CURRENT_API}/purchases?page=${page}`)

      if (response?.status === 200) {
        const { actualPage, pages, data } = response?.data
        page = actualPage + 1
        totalPages = pages
        transactionsData.push(...data)
        console.log(`Page ${actualPage} of ${pages} pushed!`)
      } else {
        failedFetches++
        console.log(`Failed fetches: ${failedFetches}`)
      }
    } while (page <= totalPages)
    const summary = await axios.get(`${CURRENT_API}`)
    const summaryData = summary?.data

    const fetchedPages = Math.ceil(transactionsData?.length / 50)

    console.log(`Checking for data integrity -> should have fetched ${totalPages} pages, and there are ${fetchedPages} in memory!`)
    console.log(`${fetchedPages === totalPages ? '✅ Data integrity check passed!' : '❌ Data integrity check failed!'}`)

    return (
      {
        purchases: transactionsData,
        summary: summaryData
      }
    )
  } catch (error) {
    throw new Error(error)
  }
}
