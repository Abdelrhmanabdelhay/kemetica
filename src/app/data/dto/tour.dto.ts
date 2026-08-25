export interface CategoryDto {
  _id: string;
  name: string;
  description?: string;
  is_active: boolean;
  display_order: number;
}

export interface TourDto {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  category: CategoryDto; // Updated to use the populated category object
  duration_days: number;
  price_usd: number;
  rating_score: number;
  reviews_count: number;
  max_group_size: number;
  featured_image_url: string;
  gallery_urls: string[];
  highlights: string[];
  city: string;
  country: string;
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
    activities: string[];
    meals: string[];
  }>;
  included_items: string[];
  excluded_items: string[];
  is_featured: boolean;
  badge_label?: string;
}
