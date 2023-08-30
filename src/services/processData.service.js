import { getBills } from '../utils/getBills.js'
import { getSummary } from '../utils/getSummary.js'
import processBillsRankingData from '../utils/processBillsRankingData.js'
import calculateDataForPlots from '../utils/calculateDataForPlots.js'
import { dataComposer } from '../utils/dataComposer.js'
import { filterUnwantedBonds } from '../utils/filterUnwantedBonds.js'

const processData = async () => {
  try {
    const rawData = await dataComposer()
    const data = filterUnwantedBonds(rawData)
    const data1 = await getBills(data)
    const data2 = await getSummary(data)
    const data3 = processBillsRankingData(data1, data2)
    const data4 = calculateDataForPlots(data1)
    return [
      data1,
      data2,
      data3,
      data4
    ]
  } catch (error) {
    console.log(error)
  }
}

export {
  processData
}
