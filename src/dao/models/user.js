import mongoose from 'mongoose'

const userCollection = 'users'

const userSchema = new mongoose.Schema({
	//propiedades - tipos de datos del esquema
	first_name: String,
	last_name: String,
	email: { type: String, unique: true },
})

const userModel = mongoose.model(userCollection, userSchema)

export default userModel
