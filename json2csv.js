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

/**
 * Adiciona um objeto a uma tabela, sendo a primeira linha o cabeçalho contendo
 * as chaves de cada valor dos objetos e cada linha seguinte representa um objeto
 * adicionado
 * @param obj - objeto
 * @param mat - matriz representando a tabela */
const addObjToMatrix = (obj, mat) => {
  // verifica se já existe cabeçalho na tabela e adiciona, caso contrario
  if (mat.length === 0) {
    mat.push([])
  }
  const cabeçalho = mat[0]
  const novaLinha = []
  for (const key in obj) {
    /** número da coluna  */
    let newIdx = -1
    cabeçalho.forEach((cell, idx) => {
      if (cell === key) {
        newIdx = idx
      }
    })
    // caso a chave não esteja presente no cabeçado da tabela até então, a adiciona
    if (newIdx === -1) {
      newIdx = cabeçalho.push(key) - 1
      for (let i = 1; i < mat.length; i++) {
        mat[i].length++
      }
    }
    novaLinha[newIdx] = obj[key]
  }
  novaLinha.length = mat[0].length
  mat.push(novaLinha)
  return mat
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
