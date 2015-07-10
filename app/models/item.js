var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ItemSchema   = new Schema({
	summary: String,
    detail: String,
    status: String
});

// export the model
module.exports = mongoose.model('Item', ItemSchema);