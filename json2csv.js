// can throw SyntaxError
const json2matrix = json => {
  const parsed = JSON.parse(json)
  if (typeof parsed !== 'object' || Array.isArray(parsed)) { // TODO: implementar
    throw new Error('Não implementado')
  }
  return Object.entries(parsed)
}

const array2csv = line => line.map(corrigeCelula).join()

const corrigeCelula = cell => {
  if (typeof cell === 'string') {
    return '"' + cell.replace(/"/g, '""') + '"'
  } else {
    return cell
  }
}

const matrix2csv = matrix => matrix.map(array2csv).join('\n')

const json2csv = json => matrix2csv(json2matrix(json))

export default json2csv
