type ReviewInput = {
  author: string;
  rating: number;
  text: string;
};

type AggregateRatingSchemaInput = {
  itemName: string;
  reviews: ReviewInput[];
};

export function aggregateRatingSchema(input: AggregateRatingSchemaInput) {
  const ratings = input.reviews.map((review) => review.rating);
  const average = ratings.reduce((sum, value) => sum + value, 0) / ratings.length;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.itemName,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: average.toFixed(1),
      reviewCount: input.reviews.length,
      bestRating: "5",
      worstRating: "1",
    },
    review: input.reviews.map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.author },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: "5",
        worstRating: "1",
      },
      reviewBody: review.text,
    })),
  };
}
