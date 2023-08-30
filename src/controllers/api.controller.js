import fs from 'fs'

const handleDataRequest = async (req, res) => {
  try {
    let resource = req.params?.resource
    switch (resource) {
      case 'bonds':
        resource = 'data1'
        break
      case 'summary':
        resource = 'data2'
        break
      case 'ranking':
        resource = 'data3'
        break
      case 'plots':
        resource = 'data4'
        break
      default:
        res.status(404).json({ message: 'Resource not found' })
    }

    const data = await fs.promises.readFile(`src/data/${resource}.json`, 'utf8')
    res.status(200).json(JSON.parse(data))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export default {
  handleDataRequest
}
