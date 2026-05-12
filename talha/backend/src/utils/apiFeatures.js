class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const search = this.queryString.search?.trim();

    if (search) {
      const regex = new RegExp(search, 'i');
      this.query = this.query.find({
        $or: [
          { title: regex },
          { description: regex },
          { location: regex },
          { category: regex }
        ]
      });
    }

    return this;
  }

  filter() {
    const filter = {};

    if (this.queryString.category) filter.category = this.queryString.category;
    if (this.queryString.location) filter.location = new RegExp(this.queryString.location, 'i');
    if (this.queryString.status) filter.status = this.queryString.status;
    if (this.queryString.featured === 'true') filter.featured = true;
    if (this.queryString.dateFrom || this.queryString.dateTo) {
      filter.date = {};
      if (this.queryString.dateFrom) filter.date.$gte = new Date(this.queryString.dateFrom);
      if (this.queryString.dateTo) filter.date.$lte = new Date(this.queryString.dateTo);
    }
    if (this.queryString.minPrice || this.queryString.maxPrice) {
      filter.price = {};
      if (this.queryString.minPrice) filter.price.$gte = Number(this.queryString.minPrice);
      if (this.queryString.maxPrice) filter.price.$lte = Number(this.queryString.maxPrice);
    }

    if (Object.keys(filter).length > 0) {
      this.query = this.query.find(filter);
    }

    return this;
  }

  sort() {
    const sortBy = this.queryString.sort || '-date';
    this.query = this.query.sort(sortBy);
    return this;
  }

  paginate() {
    const page = Math.max(parseInt(this.queryString.page, 10) || 1, 1);
    const limit = Math.max(parseInt(this.queryString.limit, 10) || 8, 1);
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    this.pagination = { page, limit };
    return this;
  }
}

module.exports = ApiFeatures;