var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BearSchema   = new Schema({
	name: String
});

// export the model
module.exports = mongoose.model('Bear', BearSchema);