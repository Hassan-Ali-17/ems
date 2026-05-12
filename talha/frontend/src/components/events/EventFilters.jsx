const defaultFilters = {
  search: '',
  category: '',
  location: '',
  dateFrom: '',
  dateTo: '',
  minPrice: '',
  maxPrice: '',
  sort: '-date'
};

export default function EventFilters({ value, onChange, onReset }) {
  const filters = value || defaultFilters;

  const handleChange = (event) => {
    onChange({ ...filters, [event.target.name]: event.target.value });
  };

  return (
    <div className="card border-0 shadow-soft mb-4">
      <div className="card-body">
        <div className="row g-3 align-items-end">
          <div className="col-lg-3 col-md-6">
            <label className="form-label">Search</label>
            <input name="search" value={filters.search} onChange={handleChange} className="form-control" placeholder="Title, location, category" />
          </div>
          <div className="col-lg-2 col-md-6">
            <label className="form-label">Category</label>
            <input name="category" value={filters.category} onChange={handleChange} className="form-control" placeholder="Tech, Music..." />
          </div>
          <div className="col-lg-2 col-md-6">
            <label className="form-label">Location</label>
            <input name="location" value={filters.location} onChange={handleChange} className="form-control" placeholder="City or venue" />
          </div>
          <div className="col-lg-2 col-md-6">
            <label className="form-label">From</label>
            <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-lg-2 col-md-6">
            <label className="form-label">To</label>
            <input type="date" name="dateTo" value={filters.dateTo} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-lg-1 col-md-6 d-grid">
            <button className="btn btn-outline-secondary" type="button" onClick={onReset}>Reset</button>
          </div>
          <div className="col-lg-3 col-md-6">
            <label className="form-label">Min Price</label>
            <input type="number" name="minPrice" value={filters.minPrice} onChange={handleChange} className="form-control" min="0" />
          </div>
          <div className="col-lg-3 col-md-6">
            <label className="form-label">Max Price</label>
            <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleChange} className="form-control" min="0" />
          </div>
          <div className="col-lg-3 col-md-6">
            <label className="form-label">Sort</label>
            <select name="sort" value={filters.sort} onChange={handleChange} className="form-select">
              <option value="-date">Newest first</option>
              <option value="date">Oldest first</option>
              <option value="price">Price low to high</option>
              <option value="-price">Price high to low</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}