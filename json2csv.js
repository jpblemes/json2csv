/** @throws SyntaxError */
const json2matrix = json => {
  const parsed = JSON.parse(json)
  if (typeof parsed !== 'object') { // TODO: implementar
    throw new Error('Não implementado')
  }
  const mat = []
  if (Array.isArray(parsed)) {
    for (const obj of parsed) {
      addObjToMatrix(obj, mat)
    }
  } else {
    addObjToMatrix(parsed, [])
  }
  return mat
}

const addObjToMatrix = (obj, mtx) => {
  if (mtx.length === 0) {
    mtx.push([])
  }
  const novaLinha = []
  const cabeçalho = mtx[0]
  for (const key in obj) {
    let newIdx = -1
    cabeçalho.forEach((cell, idx) => {
      if (cell === key) {
        newIdx = idx
      }
    })
    if (newIdx === -1) {
      newIdx = cabeçalho.push(key) - 1
      for (let i = 1; i < mtx.length; i++) {
        mtx[i].length++
      }
    }
    novaLinha[newIdx] = obj[key]
  }
  novaLinha.length = mtx[0].length
  mtx.push(novaLinha)
  return mtx
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
