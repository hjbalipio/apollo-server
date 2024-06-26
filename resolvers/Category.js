exports.Category = {
    products: ({ id: categoryId }, { filter }, { products, reviews }) => {
        const categoryProducts = products.filter((product) => product.categoryId === categoryId);
        let filteredCategoryProducts = categoryProducts;

        if(filter){
            const { onSale, avgRating } = filter;

            if(onSale === true){
                filteredCategoryProducts = filteredCategoryProducts.filter(product => {
                    return product.onSale;
                })
            }

            if([1,2,3,4,5].includes(avgRating)){
                filteredCategoryProducts = filteredCategoryProducts.filter(product => {
                    let sumRating = 0;
                    let numberOfReviews = 0;
                    reviews.forEach(review => {
                        if(review.productId === product.id){
                            sumRating += review.rating;
                            numberOfReviews++;
                        }
                    });
                    
                    const avgCategoryProductsRating = sumRating / numberOfReviews;

                    return avgCategoryProductsRating >= avgRating
                })
            }
        }
        
        return filteredCategoryProducts;
    }
}