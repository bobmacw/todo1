// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/todoDB'); // connect to our database
var Item     = require('./app/models/item');
mongoose.set('debug', true);

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Request received');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'Todo API is online' });
});

// on routes that end in /items
// ----------------------------------------------------
router.route('/items')



	// create a item (accessed at POST http://localhost:8080/items)
	.post(function(req, res) {

		var item = new Item();		// create a new instance of the Item model
		item.summary = req.body.summary;  // set the item fields from the request
        item.detail = req.body.detail;
        item.status = req.body.status;

		item.save(function(err) {
			if (err) {

                console.log('save err' + err);
                res.send(err);
            }

			res.json({ message: 'New item created' });
		});
	})

	// get all the items (accessed at GET http://localhost:8080/api/items)
	.get(function(req, res) {
		Item.find(function(err, items) {
			if (err)
				res.send(err);

			res.json(items);
		});
	});

// on routes that end in /items/:item_id
// ----------------------------------------------------
router.route('/items/:item_id')

	// get the item with that id
	.get(function(req, res) {
		Item.findById(req.params.item_id, function(err, item) {
			if (err)
				res.send(err);
			res.json(item);
		});
	})

	// update the item with this id
	.put(function(req, res) {
		Item.findById(req.params.item_id, function(err, item) {

			if (err)
				res.send(err);

            if (req.body.summary)
                item.summary = req.body.summary;
            if (req.body.detail)
                item.detail = req.body.detail;
            if (req.body.status)
                item.status = req.body.status;

            item.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Item updated!' });
			});

		});
	})

	// delete the item with this id
	.delete(function(req, res) {
		Item.remove({
			_id: req.params.item_id
		}, function(err, item) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Todo running on port ' + port);
