/* eslint-env browser */
import json2csv from './json2csv.mjs'

const convBtn = document.getElementById('converter')
const salvBtn = document.getElementById('salvar')
const jsonTxt = document.getElementById('json')
const csvTxt = document.getElementById('csv')

convBtn.onclick = function () {
  try {
    csvTxt.value = json2csv(jsonTxt.value)
    csvTxt.style.color = 'black'
  } catch (error) {
    csvTxt.value = 'Erro:\n' + error.message
    csvTxt.style.color = 'red'
  }
}

const salvaArquivo = (nome, texto, mime) => {
  const file = new Blob([texto], { type: mime })
  const a = document.createElement('a')
  const url = URL.createObjectURL(file)
  a.href = url
  a.download = nome
  document.body.appendChild(a)
  a.click()
  setTimeout(function () {
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }, 0)
}

salvBtn.onclick = function () {
  const text = csvTxt.value
  salvaArquivo('arquivo.csv', text, 'text/csv')
}
