/* eslint-env browser */
import { json2matrix, json2csv } from './json2csv.js'

const convBtn = document.getElementById('converter')
const limpBtn = document.getElementById('limpar')
const salvBtn = document.getElementById('salvar')
const jsonTxt = document.getElementById('json')
const csvTxt = document.getElementById('csv')
const alertErro = document.getElementById('alerta')
const pMsgErro = document.getElementById('mensagem-erro')
const selExemplos = document.getElementById('sel-exemplos')
const h1Tabela = document.getElementById('titulo-tabela')
const tabela = document.querySelector('table')

convBtn.onclick = function () {
  try {
    if (jsonTxt.value === '') {
      throw new Error('JSON em branco')
    }
    csvTxt.value = json2csv(jsonTxt.value)
    mostraCsv()
    limpaErro()
    mostraTabela(json2matrix(jsonTxt.value))
  } catch (error) {
    let msg = ''
    if (error instanceof SyntaxError) {
      msg += 'JSON inválido\n'
    }
    mostraErro(msg + error.message)
    limpaCsv()
  }
}

const limpaCsv = () => {
  csvTxt.classList.add('hidden')
  csvTxt.value = ''
  salvBtn.classList.add('hidden')

  limpaTabela()
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
  limpaCsv()
  selExemplos.selectedIndex = 0
}

salvBtn.onclick = function () {
  const text = csvTxt.value
  salvaArquivo('json2csv.csv', text, 'text/csv')
}

selExemplos.onchange = async function (event) {
  const arquivo = '/json_exemplos/' + event.target.value
  const res = await fetch(arquivo)
  if (res.ok) {
    jsonTxt.value = await (await res.blob()).text()
    limpaErro()
  } else {
    mostraErro(res.statusText)
  }
  limpaCsv()
}

const mostraTabela = (mat) => {
  for (let i = 0; i < mat.length; i++) {
    const tr = document.createElement('tr')
    if (i % 2 === 0) {
      tr.classList.add('bg-white')
    }
    tabela.appendChild(tr)
    for (const value of mat[i]) {
      const cell = document.createElement(i === 0 ? 'th' : 'td')
      cell.classList.add('border', 'px-4', 'py-2')
      tr.appendChild(cell)
      cell.innerText = value
    }
  }
  tabela.classList.remove('hidden')
  h1Tabela.classList.remove('hidden')
}

const limpaTabela = () => {
  tabela.innerHTML = ''
  tabela.classList.add('hidden')
  h1Tabela.classList.add('hidden')
}
