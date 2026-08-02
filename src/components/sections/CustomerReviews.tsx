import { Heading } from "@/components/ui/Heading";

export type CustomerReview = {
  author: string;
  rating: number;
  text: string;
  location: string;
};

type CustomerReviewsProps = {
  reviews: CustomerReview[];
  title?: string;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          className={`h-4 w-4 ${index < rating ? "text-accent-500" : "text-neutral-300"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function CustomerReviews({ reviews, title = "Customer reviews" }: CustomerReviewsProps) {
  return (
    <section id="reviews" className="scroll-mt-24">
      <Heading level={2} className="mb-6">
        {title}
      </Heading>
      <div className="grid gap-4 sm:grid-cols-2">
        {reviews.map((review, index) => (
          <article
            key={`${review.author}-${review.location}-${index}`}
            className="card-surface p-5"
          >
            <StarRating rating={review.rating} />
            <p className="mt-3 text-sm leading-relaxed text-[var(--foreground)]">&ldquo;{review.text}&rdquo;</p>
            <p className="mt-3 text-xs font-medium text-[var(--muted)]">
              — {review.author}, {review.location}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
