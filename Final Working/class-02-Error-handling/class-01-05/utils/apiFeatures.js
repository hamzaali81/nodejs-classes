class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter() {
      const queryObj = { ...this.queryString };
      console.log("queryObj", queryObj);
      const excludedFields = ["page", "sort", "limit", "fields"];
      excludedFields.forEach((el) => delete queryObj[el]);
  
      // Advance filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(
        /\b(gte|gt| lte|lt)\b/g,
        (match) => `$${match}`
      );
  
      // let query = Tour.find(JSON.parse(queryStr));
      this.query.find(JSON.parse(queryStr));
  
      return this;
    }
  
    sort() {
      // Sorting
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(",").join(" ");
        console.log(sortBy);
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort("-createdAt");
      }
  
      return this;
    }
  
    limitFields() {
      //3) Field limiting
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(",").join(" ");
        // query = query.select('name duration price')
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select("-__v"); //except v fields
      }
      return this;
    }
  
    paginate() {
      // Pagination
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;
      // page=2&limit=10, page 1, 11-20, page 2, 21-30 page 3
      // query = query.skip().limit(10)
      this.query = this.query.skip(skip).limit(limit);
  
      //  if(this.queryString.page){
      //    const numTours = await Tour.countDocuments();
      //    if(skip >= numTours) throw new Error('This page doesnot exist')
      //  }
  
      // query.sort().select().skip().limit()
      return this;
    }
  };

  module.exports = APIFeatures;