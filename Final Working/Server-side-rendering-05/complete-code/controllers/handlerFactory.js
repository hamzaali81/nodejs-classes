const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');


exports.deleteOne = Model => catchAsync(async (req, res, next) => {  
    const doc=  await Model.findByIdAndDelete(req.params.id);
    
    if(!doc){
      return next(new AppError('No document found with that ID', 404))
    }
  
      res.status(204).json({
        status: "success",
        data: null,
      });
  });

exports.updateOne = Model => catchAsync(async (req, res, next) => {
 
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      // runValidators: true,
      runValidators: false,
    });
    
    if(!doc){
      return next(new AppError('No document found with that ID', 404))
    }

    res.status(200).json({
      status: "success",
      data: {
       data: doc
      },
    });
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(200).json({
      status: "success",
      data: {
        data: doc
      },
    });
    next();
  });

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id).populate('reviews');
    if(popOptions) query = query.populate(popOptions);
    const doc = await query;

    // const doc = await Model.findById(req.params.id).populate('reviews');
    // const tour = await Tour.findById(req.params.id).populate({
    //   path: 'guides',
    //   select: '-__v -passwordChangedAt'
    // });
    // Tour.findOne({ _id: req.params.id});

    if(!doc){
      return next(new AppError('No document found with that ID', 404))
    }

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
});;


exports.getAll = Model => catchAsync(async (req, res, next) => {
    // EXECUTE QUERY
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    console.log('filter',filter);
    if(req.params.tourId) filter = {tour: req.params.tourId};
    console.log('req.params.tourId', req.params.tourId);
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    res.status(200).json({
      tour: doc.length,
      status: "success",
      data: {
      data : doc
      },
    });
  next();
});

