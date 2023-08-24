document.addEventListener('DOMContentLoaded', () => {
	// Check if the user has already assigned a username
	const hasUsername = localStorage.getItem('username')

	if (!hasUsername) {
		// Show the username pop-in or modal
		const modal = document.getElementById('usernameModal')
		modal.style.display = 'block'

		// Close the modal when the close button is clicked
		const closeModalBtn = document.getElementById('closeModalBtn')
		closeModalBtn.addEventListener('click', () => {
			modal.style.display = 'none'
		})

		// Save the username when the save button is clicked
		const saveUsernameBtn = document.getElementById('saveUsernameBtn')
		saveUsernameBtn.addEventListener('click', () => {
			const username = document.getElementById('usernameInput').value

			// Send the username to the server for further processing (e.g., store it in a database)
			fetch('/api/users/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username }),
			})
				.then((response) => {
					if (response.ok) {
						// The request was successful (status code 2xx)
						return response.json().then((data) => {
							// Handle the data returned by the server
							updateModal(
								`Usuario ${username} creado correctamente. <br> Iniciando sesion...`
							)

							// Close the modal after a timeout of 1 second
							setTimeout(() => {
								modal.style.display = 'none'
								location.reload()
							}, 1000)
						})
					} else {
						// The username already exists (status code 409)
						return response.json().then((data) => {
							// Handle the error response
							updateModal(`Iniciando sesion con el usuario ${username}...`)

							// Close the modal after a timeout of 1 second
							setTimeout(() => {
								modal.style.display = 'none'
								location.reload()
							}, 1000)
						})
					}
				})
				.catch((error) => {
					// Handle the error
					console.error(error)
					updateModal('Ha ocurrido un error.')
				})

			// Store the username in localStorage
			localStorage.setItem('username', username)
		})
	}

	if (hasUsername) {
		// Send the username to the server for further processing
		fetch('/api/cart', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username: hasUsername }),
		})
			.then((response) => {
				if (response.ok) {
					// The request was successful (status code 2xx)
					// Handle the response
					return response.json()
				} else {
					// The request failed with an error response
					// Handle the error
					console.error('No se pudo crear un carrito nuevo.')
				}
			})
			.then((data) => {
				// Handle the data returned by the server
			})
			.catch((error) => {
				// Handle any network or other fetch-related errors
				console.error(error)
			})
	}
})

function updateModal(message) {
	const modalTitle = document.querySelector('.modal-title')
	modalTitle.textContent = message
}

document.addEventListener('DOMContentLoaded', () => {
	const addToCartButtons = document.querySelectorAll('.addToCartBtn')

	addToCartButtons.forEach((button) => {
		button.addEventListener('click', (event) => {
			const productId = button.id
			const username = localStorage.getItem('username')

			// Send the productId and username to the server for adding to the cart
			fetch(`/api/cart/products/add/${productId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username }),
			})
				.then((response) => {
					// Handle the response
					if (response.ok) {
						const notification = document.createElement('div')
						notification.textContent = 'Peli agregada al carrito!'
						notification.classList.add('notification')

						document.body.appendChild(notification)

						setTimeout(() => {
							notification.remove()
						}, 3000)
					} else {
						// Handle the error response
						const notification = document.createElement('div')
						notification.textContent = 'Whooops! Hubo un error.'
						notification.classList.add('notification')

						document.body.appendChild(notification)

						setTimeout(() => {
							notification.remove()
						}, 3000)
					}
				})
				.catch((error) => {
					// Handle the error
				})
		})
	})
})
