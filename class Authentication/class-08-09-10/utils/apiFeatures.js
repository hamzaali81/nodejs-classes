// class APIFeatures{
//     constructor(query, queryString){
//         this.query = query;
//         this.queryString = queryString;
//     }
//     filter(){
//         const queryObj = {...this.queryString}
//         console.log('req.query',req.query);
//         console.log(queryObj)
//         const excludedFields = ['page','sort','limit','fields'];
//         excludedFields.forEach((el)=> delete queryObj[el]);
       
//         //1B Advance filtering
//         let queryStr = JSON.stringify(queryObj); //String Method
//         queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g ,match => `$${match}`);
//         // let query =  Tour.find(JSON.parse(queryStr));
//         // console.log(JSON.parse(queryStr));
//         this.query.find(JSON.parse(queryStr));
//         return this; 
//     }

//     sort(){ 
//           //?sort=price,ratingsAverage
//     if(this.queryString.sort){
//         // log(req.query.sort)
//         const sortBy = req.query.sort.split(',').join(' ');
//         console.log(sortBy);
//         query = query.sort(sortBy);  //sort('price ratingAverage)
//       }else{
//         query = query.sort('-createdAt');
//       }
//       return this;
//     }
//     limitFields(){
//         if(this.queryString.fields){
//             log(req.query.sort)
//             const fields = this.queryString.fields.split(',').join(' ');
//             // console.log(fields);
//             this.query = this.query.sort(fields);  //sort('price ratingAverage)
//           }
//           else{
//             this.query = this.query.sort('-v');
//           }
//           return this;
//     }
//     paginate(){
//         const page = this.queryString.page * 1 || 1;
//     const limit = req.query.limit * 1 || 100;
//     const skip = (page - 1) * limit;
//     this.query = this.query.skip(skip).limit(limit);
//     //  if(req.query.page){
//     //    const numTours = await Tour.countDocuments();
//     //    if(skip >= numTours) throw new Error('This page doesnot exist');       
//     //  }
//        return this;
//     }

// }

// module.exports = APIFeatures;

//02
// class APIFeatures {
//     constructor(query, queryString) {
//       this.query = query;
//       this.queryString = queryString;
//     }
  
//     filter() {
//       const queryObj = { ...this.queryString };
//       const excludedFields = ['page', 'sort', 'limit', 'fields'];
//       excludedFields.forEach(el => delete queryObj[el]);
  
//       // 1B) Advanced filtering
//       let queryStr = JSON.stringify(queryObj);
//       queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  
//       this.query = this.query.find(JSON.parse(queryStr));
  
//       return this;
//     }
  
//     sort() {
//       if (this.queryString.sort) {
//         const sortBy = this.queryString.sort.split(',').join(' ');
//         this.query = this.query.sort(sortBy);
//       } else {
//         this.query = this.query.sort('-createdAt');
//       }
  
//       return this;
//     }
  
//     limitFields() {
//       if (this.queryString.fields) {
//         const fields = this.queryString.fields.split(',').join(' ');
//         this.query = this.query.select(fields);
//       } else {
//         this.query = this.query.select('-__v');
//       }
  
//       return this;
//     }
  
//     paginate() {
//       const page = this.queryString.page * 1 || 1;
//       const limit = this.queryString.limit * 1 || 100;
//       const skip = (page - 1) * limit;
  
//       this.query = this.query.skip(skip).limit(limit);
  
//       return this;
//     }
//   }
//   module.exports = APIFeatures;
  
//03
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;