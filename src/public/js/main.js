// Get the value of the 'username' key from localStorage
const username = localStorage.getItem('username')

// Use the value of 'username' to display it on the page
const usernameElement = document.getElementById('username')
if (username) {
	usernameElement.textContent = username
	usernameElement.title = 'Cerrar sesión'
	usernameElement.style.cursor = 'pointer'
	usernameElement.addEventListener('click', () => {
		localStorage.removeItem('username')
		location.reload()
	})
} else {
	usernameElement.textContent = 'Visitante'
}

document.addEventListener('DOMContentLoaded', () => {
	const cartLink = document.getElementById('cart-link')

	cartLink.addEventListener('click', (event) => {
		event.preventDefault()

		const url = `/cart?username=${username}`

		window.location.href = url
	})
})
