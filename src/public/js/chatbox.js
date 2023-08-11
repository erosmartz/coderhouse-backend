import axios from 'axios'

import axios from 'axios'

const chatForm = document.getElementById('chatForm')
const userInfoForm = document.getElementById('userInfoForm')

chatForm.addEventListener('submit', async (e) => {
	e.preventDefault()
	const message = document.getElementById('messageInput').value

	try {
		// Send the message to the server using the '/api/messages/send' endpoint
		const response = await axios.post('/api/messages/send', {
			content: message,
		})

		// Handle the response accordingly
		if (response.status === 200) {
			// Message sent successfully
			console.log('Message sent successfully')
		} else {
			// Error sending message
			console.error('Error sending message')
		}
	} catch (error) {
		// Error sending message
		console.error('Error sending message', error)
	}
})

userInfoForm.addEventListener('submit', async (e) => {
	e.preventDefault()
	const firstName = document.getElementById('firstNameInput').value
	const lastName = document.getElementById('lastNameInput').value
	const email = document.getElementById('emailInput').value

	try {
		// Send the user information to the server using the '/api/users/create' endpoint
		const response = await axios.post('/api/users/create', {
			first_name: firstName,
			last_name: lastName,
			email,
		})

		// Handle the response accordingly
		if (response.status === 201) {
			// User created successfully
			console.log('User created successfully')
			userInfoForm.classList.add('inactive') // Hide the userInfoForm
		} else {
			// Error creating user
			console.error('Error creating user')
		}
	} catch (error) {
		// Error creating user
		console.error('Error creating user', error)
	}
})
