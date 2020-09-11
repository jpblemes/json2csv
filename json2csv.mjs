// can throw SyntaxError
const json2obj = json => {
  const parsed = JSON.parse(json)
  if (typeof parsed !== 'object' || Array.isArray(parsed)) { // TODO: implementar
    throw new Error('Não implementado')
  }
  return Object.entries(parsed)
}

const array2csv = line => line.join()

const matrix2csv = matrix => matrix.map(array2csv).join('\n')

const json2csv = json => matrix2csv(json2obj(json))

export default json2csv
