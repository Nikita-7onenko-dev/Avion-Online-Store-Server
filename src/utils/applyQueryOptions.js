

export default function applyQueryOptions(query, {search, filters, sorting, alreadyLoaded, limit}) {

  let parsedFilters;
  try {
    parsedFilters = filters ? JSON.parse(filters) : null;
  } catch(err) {
    parsedFilters = null;
    console.error("Failed to parse filters: ", err)
  }

  if(search) {
    query = query.find({
       name: { $regex: search, $options: "i" }
    })
  }

  if(parsedFilters) {

    if(parsedFilters.productType.length > 0) {
      query = query.find( {productType: {$in: parsedFilters.productType}} )
    }

    if(parsedFilters.category.length > 0) {
      query = query.find( {category: {$in: parsedFilters.category}} )
    }

    if(parsedFilters.designers.length > 0) {
      query = query.find( {designer: {$in: parsedFilters.designers}} )
    }

    if( parsedFilters.priceFilters.length > 0) {
      const priceQuery = parsedFilters.priceFilters.map(range => {
        if(range === '0 - 100') return  {price: {$gte : 0, $lte: 100}};
        if(range === '101 - 250') return {price: {$gte: 101, $lte: 250}}
        if(range === '250+') return {price: {$gte: 250}};
      }).filter(Boolean);

      query = query.find( {$or: priceQuery} )
    }

  }  

  if(sorting) {
    if(sorting === 'Price: Low to High') query = query.sort( {price: 1 } );
    if(sorting === 'Price: High to Low') query = query.sort( {price: -1} );
    if(sorting === 'Newest') query = query.sort( {dateAdded: -1} );
    if(sorting === 'Best sellers') query = query.sort( {popularityScore: -1} );
  }

  query = query.skip(Number(alreadyLoaded)).limit(Number(limit) + 1);

  return query;
}