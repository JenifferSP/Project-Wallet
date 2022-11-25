import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

//array de cores para os cartoes
function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

//testa o cartao pelo terminal web
globalThis.setCardType = setCardType

//tratamento codigo de segurança
const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "000",
}

const securityCodeMasked = IMask(securityCode, securityCodePattern)

//tratamento data de vencimento
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },

    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)
//tratamento numero do cartao
const cardNumber = document.querySelector("#card-number")
//mascara dinamica
const cardNumberPattern = {
  mask: [
    {
      //expressao regular (regra do cartao)
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      //expressao regular (regra do cartao)
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],

  //funcao para filtrar e encontrar os dados
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

//manipulaçao evento do btn
const addButton = document.querySelector("#add-card")

//observa se tera um evento de click e executa uma funcao
addButton.addEventListener("click", () => {
  alert("cartão adicionado com sucesso")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

//exibindo o nome no cartao
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

//exibindo o numero cvc no cartao
securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecutiry = document.querySelector(".cc-security .value")
  ccSecutiry.innerText = code.length === 0 ? "123" : code
}

//exibindo o numero do cartao
cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

//exbindo a data
expirationDateMasked.on("accept", () => {
  uptadeExpirationDate(expirationDateMasked.value)
})

function uptadeExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value")
  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}
