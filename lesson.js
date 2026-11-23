const phoneInput = document.querySelector('#phone_input')
const phoneButton = document.querySelector('#phone_button')
const phoneResult = document.querySelector('#phone_result')

const phoneRegExp = /^\+996 \d{3} \d{2}-\d{2}-\d{2}$/

phoneButton.onclick = () => {
    if (phoneRegExp.test(phoneInput.value)) {
        phoneResult.innerHTML = 'Всё верно'
        phoneResult.style.color = 'green'
    } else {
        phoneResult.innerHTML = 'Некорректный номер телефона'
        phoneResult.style.color = 'red'
    }
}

const tabContentBlocks = document.querySelectorAll('.tab_content_block')
const tabContentItems = document.querySelectorAll('.tab_content_item')
const tabContentItemsParent = document.querySelector('.tab_content_items')

let currentTab = 0
let tabIntervalId = null

const hideTabContent = () => {
    tabContentBlocks.forEach((block) => {
        block.style.display = 'none'
    })
    tabContentItems.forEach((item) => {
        item.classList.remove('tab_content_item_active')
    })
}

const showTabContent = (index = 0) => {
    tabContentBlocks[index].style.display = 'flex'
    tabContentItems[index].classList.add('tab_content_item_active')
}

const startAutoTabs = () => {
    clearInterval(tabIntervalId)
    tabIntervalId = setInterval(() => {
        currentTab = currentTab < tabContentBlocks.length - 1 ? currentTab + 1 : 0
        hideTabContent()
        showTabContent(currentTab)
    }, 3000)
}

tabContentItemsParent.onclick = (event) => {
    if (event.target.classList.contains('tab_content_item')) {
        tabContentItems.forEach((item, index) => {
            if (event.target === item) {
                currentTab = index
                hideTabContent()
                showTabContent(currentTab)
                startAutoTabs()
            }
        })
    }
}

hideTabContent()
showTabContent(currentTab)
startAutoTabs()

const cardsCount = 200
const cardBlock = document.querySelector('.card')
const buttonPrev = document.querySelector('#btn-prev')
const buttonNext = document.querySelector('#btn-next')

let cardId = 1

const getCard = async (id) => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
        const {title, completed} = await response.json()
        cardBlock.innerHTML = `
            <p>${title}</p>
            <span>№ ${id} — ${completed ? 'выполнено' : 'не выполнено'}</span>
        `
    } catch (error) {
        cardBlock.innerHTML = '<p>Не удалось загрузить карточку</p>'
    }
}

const switchCard = (step) => {
    cardId += step
    if (cardId > cardsCount) cardId = 1
    if (cardId < 1) cardId = cardsCount
    getCard(cardId)
}

buttonNext.onclick = () => switchCard(1)
buttonPrev.onclick = () => switchCard(-1)

getCard(cardId)

const somInput = document.querySelector('#som')
const usdInput = document.querySelector('#usd')
const eurInput = document.querySelector('#eur')

const converterInputs = {
    som: somInput,
    usd: usdInput,
    eur: eurInput
}

const convert = (currentKey) => {
    converterInputs[currentKey].oninput = async () => {
        try {
            const response = await fetch('../data/converter.json')
            const rates = await response.json()
            rates.som = 1
            const value = converterInputs[currentKey].value
            for (const key in converterInputs) {
                if (key !== currentKey) {
                    converterInputs[key].value = value === ''
                        ? ''
                        : (value * rates[currentKey] / rates[key]).toFixed(2)
                }
            }
        } catch (error) {
            console.warn('Не удалось получить курс валют', error)
        }
    }
}

convert('som')
convert('usd')
convert('eur')
