document.addEventListener('DOMContentLoaded', function () {
	// Event listener for the "list" button
	const listButton = document.querySelector('.list')
	listButton.addEventListener('click', function (event) {
		event.preventDefault()
		const username = localStorage.getItem('username')
		const url = `/cart?list=true&username=${username}`
		window.location.href = url
	})

	// Event listener for the "cards" button
	const cardsButton = document.querySelector('.cards')
	cardsButton.addEventListener('click', function (event) {
		event.preventDefault()
		const username = localStorage.getItem('username')
		const url = `/cart?list=false&username=${username}`
		window.location.href = url
	})
})

const decrementButtons = document.querySelectorAll('.decrement')
const incrementButtons = document.querySelectorAll('.increment')

decrementButtons.forEach((button) => {
	button.addEventListener('click', (event) => {
		const productid = event.currentTarget.parentNode.id
		updateQuantity(productid, 'decrement')
	})
})

incrementButtons.forEach((button) => {
	button.addEventListener('click', (event) => {
		const productid = event.currentTarget.parentNode.id
		updateQuantity(productid, 'increment')
	})
})

async function updateQuantity(productid, action) {
	const username = localStorage.getItem('username') // using the value of the 'username' key

	const url = `/api/cart?username=${username}&productid=${productid}&update=${action}`

	try {
		const response = await fetch(url, {
			method: 'PUT', // Use the PUT method for updating the quantity
		})

		if (response.ok) {
			// Handle success
			console.log('Cantidad actualizada:' + action)
			// Refresh the cart or update the UI accordingly
			location.reload()
		} else {
			// Handle error
			console.log('Cantidad no actualizada::' + response.error)
		}
	} catch (error) {
		console.error('Cantidad no actualizada:' + error)
	}
}

// Select elements with class "priceValue" and "quantityValue"
const priceElements = document.querySelectorAll('.priceValue')
const quantityElements = document.querySelectorAll('.quantityValue')

// Calculate total price and total quantity
let totalPrice = 0
let totalQuantity = 0

priceElements.forEach((element) => {
	totalPrice += parseFloat(element.innerText)
})

quantityElements.forEach((element) => {
	totalQuantity += parseInt(element.innerText)
})

// Update the DOM with the total values
document.getElementById('totalPrice').innerText = totalPrice.toFixed(2)
document.getElementById('totalQuantity').innerText = totalQuantity
