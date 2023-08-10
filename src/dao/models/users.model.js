import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	//propiedades - tipos de datos del esquema
	first_name: String,
	last_name: String,
	email: { type: String, unique: true },
})

const User = mongoose.model('users', userSchema)

export default User
