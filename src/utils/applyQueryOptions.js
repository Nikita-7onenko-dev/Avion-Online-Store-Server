

export default function applyQueryOptions(query, {search, filters, sorting, alreadyLoaded, limit}) {

  if(search) {
    query = query.find({
       name: { $regex: search, $options: "i" }
    })
  }

  if(filters) {

    if(filters.productType.length > 0) {
      query = query.find( {productType: {$in: filters.productType}} )
    }

    if(filters.category.length > 0) {
      query = query.find( {category: {$in: filters.category}} )
    }

    if(filters.designers.length > 0) {
      query = query.find( {designer: {$in: filters.designers}} )
    }

    if( filters.priceFilters.length > 0) {
      const priceQuery = filters.priceFilters.map(range => {
        if(range === '0 - 100') return  {price: {$gte : 0, $lte: 100}};
        if(range === '101 - 250') return {price: {$gte: 101, $lte: 250}}
        if(range === '250+') return {price: {$gte: 250}};
      })

      query = query.find( {$or: priceQuery} )
    }

  }  

  if(sorting) {
    if(sorting === 'Price: Low to High') query = query.sort( {price: 1 } );
    if(sorting === 'Price: High to Low') query = query.sort( {price: -1} );
    if(sorting === 'Newest') query = query.sort( {dateAdded: -1} );
    if(sorting === 'Best sellers') query = query.sort( {popularityScore: -1} );
  }

  query = query.skip(alreadyLoaded).limit(limit);

  return query;
}