

//#region UI NAV/FUNCTIONALITY

let resetTimeout
function settingsMenuOpen(){
  document.getElementById("settingsButton").classList.add('hidden')
  document.getElementById("closeButton").classList.remove('hidden')
  document.getElementById("game").classList.add('hidden')
  document.getElementById('settingsMenu').classList.remove('hidden')
  calculateRebirthData()
  draw()
}
function settingsMenuClose(){
  document.getElementById("closeButton").classList.add('hidden')
  document.getElementById("settingsButton").classList.remove('hidden')
  document.getElementById('settingsMenu').classList.add('hidden')
  document.getElementById('game').classList.remove('hidden')
}
function initializeReset(){
  document.getElementById('resetProgressButton').classList.add('hidden')
  document.getElementById('resetConfirm').classList.remove('hidden')
  resetTimeout = setTimeout(resetTimedOut, 3000)
}
function confirmReset(){
  clearTimeout(resetTimeout)
  money = 0
  pepe.count = 0
  auto.count = 0
  giga.count = 0
  gamer.count = 0
  business.count = 0
  jesus.count = 0
  saveData()
  calculateNewPrices()
  resetTimedOut()
  draw()
}
function resetTimedOut(){
  document.getElementById('resetConfirm').classList.add('hidden')
  document.getElementById('resetProgressButton').classList.remove('hidden')
}

function disableInterval(){
  clearInterval(timerID)
  document.getElementById('timerDisable').classList.add('hidden')
  document.getElementById('timerEnable').classList.remove('hidden')
}
function enableInterval(){
  timerID = setInterval(updateFunc, 1000)
  document.getElementById('timerDisable').classList.remove('hidden')
  document.getElementById('timerEnable').classList.add('hidden')
}

function requestRebirth(){
  let rebirthButton = document.getElementById('rebirthButton')
  if(canRebirth()){
    rebirth()
    rebirthButton.innerHTML = 'Success!'
    rebirthButton.style.backgroundColor = '#00ff00'
    setTimeout(function(){
      rebirthButton.innerHTML = 'Rebirth'
      rebirthButton.style.backgroundColor = '#ffad29'
    },1000)
  }else{
    rebirthButton.innerHTML = 'Need More Cashflow'
    rebirthButton.style.backgroundColor = '#ff0000'
    setTimeout(function(){
      rebirthButton.innerHTML = 'Rebirth'
      rebirthButton.style.backgroundColor = '#ffad29'
    },1000)
  }
  calculateRebirthData()
  draw()
}


//#endregion



//#region GAME CODE


//#region Global Variables

let cashFlow = 0
let money = 0
let rebirths = {
  count: 0,
  cost: 0,
  boost: 1,
  basePrice: 10000
}
let pepe = {
  count: 0,
  x1:0,
  x10:0,
  x100:0,
  basePrice: 10
}
let auto = {
  count: 0,
  x1:0,
  x10:0,
  x100:0,
  basePrice: 80
}
let giga = {
  count: 0,
  x1:0,
  x10:0,
  x100:0,
  basePrice: 700
}
let gamer = {
  count: 0,
  x1:0,
  x10:0,
  x100:0,
  basePrice: 2000
}
let business = {
  count: 0,
  x1:0,
  x10:0,
  x100:0,
  basePrice: 5000
}
let jesus = {
  count: 0,
  x1:0,
  x10:0,
  x100:0,
  basePrice: 100000
}
let workers = [pepe, auto, giga, gamer, business, jesus]

let multiplier = 1

let timeElapsed = 0


//#endregion


//#region Money collection Functions
function clicked(){
  let sum = (1 + pepe.count)
  if(jesus.count > 0)sum *= (5*jesus.count)
  money += Math.ceil(sum*rebirths.boost)
  clickFireFrog()
  clickFireFrog()
  draw()
}
function updateFunc(){
  timeElapsed ++
  let sum = auto.count + (giga.count*10) + (gamer.count*100) + (business.count*1000)
  if(jesus.count > 0)sum *= (5*jesus.count)
  money += Math.ceil(sum*rebirths.boost)
  cashFlow = Math.ceil(sum*rebirths.boost)
  if(timeElapsed % 10 == 0)saveData()
  draw()
}

//#endregion


//#region Buy Functions

function buyPepe(){
  if(enoughMoney(pepe["x"+multiplier])){
    money -= pepe["x"+multiplier]
    pepe.count += multiplier
  }
  calculateNewPrices()
  draw()
}
function buyAuto(){
  if(enoughMoney(auto["x"+multiplier])){
    money -= auto["x"+multiplier]
    auto.count += multiplier
  }
  calculateNewPrices()
  draw()
}
function buyGiga(){
  if(enoughMoney(giga["x"+multiplier])){
    money -= giga["x"+multiplier]
    giga.count += multiplier
  }
  calculateNewPrices()
  draw()
}
function buyGamer(){
  if(enoughMoney(gamer["x"+multiplier])){
    money -= gamer["x"+multiplier]
    gamer.count += multiplier
  }
  calculateNewPrices()
  draw()
}
function buyBusiness(){
  if(enoughMoney(business["x"+multiplier])){
    money -= business["x"+multiplier]
    business.count += multiplier
  }
  calculateNewPrices()
  draw()
}
function buyJesus(){
  if(enoughMoney(jesus["x"+multiplier])){
    money -= jesus["x"+multiplier]
    jesus.count += multiplier
  }
  calculateNewPrices()
  draw()
}
function rebirth(){
  confirmReset()
  rebirths.count++
  calculateRebirthData()
  calculateNewPrices()
  draw()
}

//#endregion


//#region Cost Calculation Functions

function multiChange(clickedMult){
  if(multiplier == clickedMult)return
  document.getElementById(multiplier).style.borderColor = "#000000"
  document.getElementById(clickedMult).style.borderColor = "#ffffff"
  multiplier = clickedMult
  calculateNewPrices()
  draw()
}
function calculateUnitPrice(basePrice, count){
  return Math.ceil(Math.pow(basePrice, 1+ (count/100)))
}
function calculateMultiplePrice(basePrice, count, amount){
  result = 0
  for(i = 0; i < amount; i++){
    result += calculateUnitPrice(basePrice, count + i)
    
  }
  return result
}
function calculateNewPrices(){
  workers.forEach(worker => {
    worker['x'+multiplier] = calculateMultiplePrice(worker.basePrice, worker.count, multiplier)
  });
}
function calculateRebirthData(){
  rebirth.cost = Math.ceil(Math.pow(rebirths.basePrice, 1+(rebirths.count/10)))
  if(rebirths.count == 0)rebirths.cost = rebirths.basePrice
  rebirths.boost = 1 + (rebirths.count/10)
}




//#endregion


//#region Load/Save Functions

function loadData(){
  let frogGameData = JSON.parse(window.localStorage.getItem("frogGameData"))
  if(frogGameData){
    money = frogGameData.money
    rebirths.count = frogGameData.rebirths
    pepe.count = frogGameData.pepeCount
    auto.count = frogGameData.autoCount
    giga.count = frogGameData.gigaCount
    gamer.count = frogGameData.gamerCount
    business.count = frogGameData.businessCount
    jesus.count = frogGameData.jesusCount
  }
}
function saveData(){
  let frogGameData = {
    money: money,
    rebirths: rebirths.count,
    pepeCount: pepe.count,
    autoCount: auto.count,
    gigaCount: giga.count,
    gamerCount: gamer.count,
    businessCount: business.count,
    jesusCount: jesus.count
  }
  window.localStorage.setItem("frogGameData", JSON.stringify(frogGameData))
}

//#endregion


//#region Utility Functions

function enoughMoney(cost){
  if(cost<=money)return true
  return false
}
function draw(){
  document.getElementById('money').innerHTML = condenseNum(money)
  document.getElementById('rebirthCount').innerHTML = condenseNum(rebirths.count)
  document.getElementById('pepeCount').innerHTML = condenseNum(pepe.count)
  document.getElementById('pepePrice').innerHTML = condenseNum(pepe["x"+multiplier])
  document.getElementById('autoCount').innerHTML = condenseNum(auto.count)
  document.getElementById('autoPrice').innerHTML = condenseNum(auto["x"+multiplier])
  document.getElementById('gigaCount').innerHTML = condenseNum(giga.count)
  document.getElementById('gigaPrice').innerHTML = condenseNum(giga["x"+multiplier])
  document.getElementById('gamerCount').innerHTML = condenseNum(gamer.count)
  document.getElementById('gamerPrice').innerHTML = condenseNum(gamer["x"+multiplier])
  document.getElementById('businessCount').innerHTML = condenseNum(business.count)
  document.getElementById('businessPrice').innerHTML = condenseNum(business["x"+multiplier])
  document.getElementById('jesusCount').innerHTML = condenseNum(jesus.count)
  document.getElementById('jesusPrice').innerHTML = condenseNum(jesus["x"+multiplier])

  document.getElementById('rebirthCost').innerHTML = condenseNum(rebirth.cost)
  document.getElementById('cashPerSec').innerHTML = condenseNum(cashFlow)
}
function canRebirth(){
  calculateRebirthData()
  if(rebirth.cost < cashFlow)return true
  return false
}
function condenseNum(num){
  let abbreviations = ['','K', 'M', 'B', 't', 'q', 'Q', 's', 'S', 'o', 'n', 'd', 'U', 'D', 'T', 'Qt']
  for(let i = 0; true; i++){
    if(num/(Math.pow(1000, i)) < 1000)return (cutDecimal(num/(Math.pow(1000, i))) + ' ' + abbreviations[i])
  }
}
function cutDecimal(num){
  if(num % 1 == 0)return num
  num = num.toString()
  let parts = num.split('.')
  return parts[0] + '.' + parts[1].substring(0,1)
}


//#endregion



loadData()
calculateNewPrices()
calculateRebirthData()
let timerID = setInterval(updateFunc, 1000)
draw()

//#endregion



//#region ANIMATION FUNCTIONS

function clickFireFrog(){
  let frog = document.createElement('div')
  frog.classList.add('fireFrog')
  let keyframeID = "shoot"+Math.floor(Math.random()*999999999)
  let angle = Math.floor(Math.random()*360)
  frog.style.transform = `rotate(-${angle}deg)`
  let css = window.document.styleSheets[0]
  css.insertRule(`
    @keyframes ${keyframeID}{
      100%{
        transform: translate(${1000*(Math.cos(angle))}px, ${1000*(Math.sin(angle))}px);
      }
    }`
  )
  frog.style.animationName = keyframeID

  let container = document.getElementById('coinContainer')
  let coin = document.getElementById('coin')
  container.insertBefore(frog, coin)

  setTimeout(forgetFrog, 6000, frog)
}
function forgetFrog(frog){
  frog.parentNode.removeChild(frog)
}



//#endregion

