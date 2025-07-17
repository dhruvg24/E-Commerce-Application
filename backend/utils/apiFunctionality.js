class APIFunctionality {
  constructor(query, queryStr) {
    (this.query = query), (this.queryStr = queryStr);
    // say /api/products/:id?keyword=Shirt
    // keyword=Shirt is the queryStr, the remaining part is query
  }

  search() {
    // search for products
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
            // i is for case insensitive.
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    // filter by what? this helps in filtering, removing other query parameters and keeping only what is necessary.

    // console.log(queryCopy);
    const removeFields = ["keyword", "page", "limit"];
    // limit - for pagination.
    removeFields.forEach((key) => delete queryCopy[key]);
    this.query = this.query(queryCopy);
    return this;
  }

  pagination(resultsPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultsPerPage * (currentPage - 1);
    // say curr page is 3 and resPerPage = 10, therefore skip 20 products and from 3rd page 21st,22nd,23rd product will be displayed in order to maintain resPerPage = 10

    this.query = this.query.limit(resultsPerPage).skip(skip);
    // limit -> limits the number of products
    // skip -> the logic displays the products suited for that page according to logic.

    // Issue that may come
    // say we filter by category = shirts, we have in total 5 pages, but after filtering we have only 2 shirts, which can be made available in single page and no need to make appear 5 pages.

    return this;
  }
}

export default APIFunctionality;
