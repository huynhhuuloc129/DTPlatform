var mongoose = require('mongoose');
var Schema = mongoose.Schema;

roadSchema = new Schema( {
	type: String, 
	geometry: Object,
	properties: Object,
	id: Number,
}),
road = mongoose.model('road', roadSchema);

module.exports = road;