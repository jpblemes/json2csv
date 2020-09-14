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
const tabela = document.querySelector('table')
const divTabela = document.getElementById('table-div')
const divCodigo = document.getElementById('codigo')
const btnTabTexto = document.getElementById('btn-tab-texto')
const btnTabTabela = document.getElementById('btn-tab-tabela')

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
      tr.classList.add('bg-gray-100')
    }
    tabela.appendChild(tr)
    for (const value of mat[i]) {
      const cell = document.createElement(i === 0 ? 'th' : 'td')
      cell.classList.add('border', 'px-4', 'py-2')
      tr.appendChild(cell)
      cell.innerText = value
    }
  }
  btnTabTabela.classList.remove('disabled')
}

const limpaTabela = () => {
  tabela.innerHTML = ''
  btnTabTabela.classList.add('disabled')
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').then(function (registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope)
    }, function (err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err)
    })
  })
}

btnTabTabela.onclick = () => {
  if (!btnTabTabela.classList.contains('disabled')) {
    divTabela.classList.remove('hidden')
    divCodigo.classList.add('hidden')
  }
}

btnTabTexto.onclick = () => {
  divTabela.classList.add('hidden')
  divCodigo.classList.remove('hidden')
}
