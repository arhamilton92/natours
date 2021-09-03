const tours = require(`${__dirname}/../dev-data/data/tours-simple.json`);

exports.checkID = (req, res, next, val) => {
	if (req.params.id * 1 > tours.length) {
		res.status(404).json({
			status: 'fail',
			message: 'invalid id',
		});
	}
	else next();
};

exports.checkBody = (req, res, next) => {
	console.log('running checkBody')
	if (!req.body.name || !req.body.price) {
		res.status(400).json({
			status: 'fail',
			message: 'name and price required',
		});
	}
	else next();
};

exports.getAllTours = (req, res) => {
	res.status(200).json({
		status: 'success',
		results: tours.length,
		data: tours,
	});
};

exports.getTour = (req, res) => {
	const id = req.params.id * 1;
	const tour = tours.find((el) => el.id === id);

	res.status(200).json({
		status: 'success',
		data: tour,
	});
};

exports.createTour = (req, res) => {
	const newId = tours[tours.length - 1].id + 1;
	const newTour = Object.assign({ id: newId }, req.body);
	tours.push(newTour);
	//
	res.send('success');
};

exports.updateTour = (req, res) => {
	const id = req.params.id * 1;
	const tour = tours.find((el) => el.id === id);

	res.status(200).json({
		status: 'success',
		message: 'tour updated',
		data: {
			tour: '<updated tour here>',
		},
	});
};

exports.deleteTour = (req, res) => {
	const id = req.params.id * 1;
	const tour = tours.find((el) => el.id === id);
	res.status(204).json({
		status: 'success',
		message: 'tour deleted',
		data: {
			tour: null,
		},
	});
};
