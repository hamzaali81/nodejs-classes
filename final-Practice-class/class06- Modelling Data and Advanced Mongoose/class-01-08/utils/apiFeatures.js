class APIFeatures {
    constructor (query, queryString){
      this.query = query;
      this.queryString = queryString;
    }
    // filter(){
    //   const queryObj = {...this.queryString};
    //   // const queryObj = {...req.query};
    //     const excludedFields = ['page', 'sort', 'limit', 'fields'];
    //     excludedFields.forEach((el)=> delete queryObj[el])
        
    //     // 1B) Advance filtering
    //     console.log(req.query, queryObj);
        
    //     let queryStr = JSON.stringify(queryObj);
    //    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    //     console.log(JSON.parse(queryStr));
  
       
    //     // let query = Tour.find(JSON.parse(queryStr));
        
    //     // console.log(req.query);
    //     this.query.find(JSON.parse(queryStr));
    //     return this;    
    // }
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
  
    // sort(){
    //   if(this.queryString.sort){
    //     query = query.sort(req.query.sort);
    //     // sort('price ratingsAverage')
    //     const sortBy = this.queryString.sort.split(',').join(' ');
    //     console.log(sortBy);
    //     query = query.sort(sortBy);
    //     // sort('price ratingsAverage')
    //   }
    //   else {
    //     query = query.sort('--createdAt')
    //   }
    //   return this;
    // }
    sort() {
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-createdAt');
      }
  
      return this;
    }
  
    limitFields(){
      if(this.queryString.fields){
        const fields = this.queryString.fields.split(',').join(' ');  //join(Array convert in string)
   // The split() method is used to split a string into an array of substrings, and returns the new array. Tip: If an empty string ("") is used as the separator, the string is split between each character. Note: The split() method does not change the original string.
        this.query = this.query.select(fields);
      }
      else {
        this.query = this.query.select('-__v')
       }
    return this;
      }
      paginate(){
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit  * 1 || 100;
        const skip = (page -1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        // if(req.query.page){
        //   const numTours = await Tour.countDocuments();
        //   if(skip >= numTours) throw new Error('This page does not exist'); 
        // }
        return this;
      }
  }

  
  module.exports = APIFeatures;