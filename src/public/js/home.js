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
							console.log(data.message)
							updateModal(
								`Usuario creado correctamente. <br> Bienvenid@ ${username}.`
							)
						})
					} else {
						// The username already exists (status code 409)
						return response.json().then((data) => {
							// Handle the error response
							console.log(data.error)
							updateModal(`El usuario ${username} ya existe.`)
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

			// Close the modal after a timeout of 1/2 second
			setTimeout(() => {
				modal.style.display = 'none'
			}, 500)
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
				console.log(
					`Carrito del usuario ${hasUsername}: ${JSON.stringify(data, null, 2)}`
				)
			})
			.catch((error) => {
				// Handle any network or other fetch-related errors
				console.error(error)
			})
	}
})

function updateModal(message) {
	const modalTitle = document.getElementsByClassName('.modal-title')
	modalTitle.textContent = message
}

function addToCart(productId) {
	console.log('hello')
	console.log(productId)
	/* 	fetch(`/api/cart/?productId=${productId}`, {
		method: 'POST',
	})
		.then((response) => {
			// Handle the response
		})
		.catch((error) => {
			// Handle the error
		}) */
}

function test() {
	console.log('test')
}
