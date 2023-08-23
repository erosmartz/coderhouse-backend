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
