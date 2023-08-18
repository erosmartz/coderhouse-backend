import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new mongoose.Schema({
	id: { type: String, required: true },
	title: { type: String, required: true },
	description: { type: String, required: true },
	code: { type: String, required: true },
	price: { type: Number, required: true },
	status: { type: Boolean, default: true },
	stock: { type: Number, required: true },
	category: { type: String },
	thumbnails: [{ type: String }],
})

productSchema.plugin(mongoosePaginate)

const Product = mongoose.model('products', productSchema)

export default Product
