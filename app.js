/* eslint-env browser */
import json2csv from './json2csv.js'

const convBtn = document.getElementById('converter')
const limpBtn = document.getElementById('limpar')
const salvBtn = document.getElementById('salvar')
const jsonTxt = document.getElementById('json')
const csvTxt = document.getElementById('csv')
const alertErro = document.getElementById('alerta')
const pMsgErro = document.getElementById('mensagem-erro')

convBtn.onclick = function () {
  try {
    csvTxt.value = json2csv(jsonTxt.value)
    mostraCsv()
    limpaErro()
  } catch (error) {
    csvTxt.value = 'Erro:\n' + error.message
    mostraErro(error.message)
    escondeCsv()
  }
}

const escondeCsv = () => {
  csvTxt.classList.add('hidden')
  salvBtn.classList.add('hidden')
}

const mostraCsv = () => {
  csvTxt.classList.remove('hidden')
  salvBtn.classList.remove('hidden')
}

const mostraErro = mensagem => {
  alertErro.classList.remove('hidden')
  pMsgErro.innerText = mensagem
}

const limpaErro = () => {
  alertErro.classList.add('hidden')
  pMsgErro.innerText = ''
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

limpBtn.onclick = function () {
  jsonTxt.value = ''
  csvTxt.value = ''
  limpaErro()
  escondeCsv()
}

salvBtn.onclick = function () {
  const text = csvTxt.value
  salvaArquivo('json2csv.csv', text, 'text/csv')
}
