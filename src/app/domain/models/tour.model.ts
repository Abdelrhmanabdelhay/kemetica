

export interface TourItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  activities: string[];
  mealsIncluded: string[];
}

export interface TourReview {
  id: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  displayOrder: number;
}

export interface Tour {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  category: Category;
  durationDays: number;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  groupSizeMax: number;
  featuredImage: string;
  galleryImages: string[];
  highlights: string[];
  city: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  itinerary: TourItineraryDay[];
  included: string[];
  notIncluded: string[];
  isFeatured: boolean;
  badge?: string;
}

export interface TourFilterOptions {
  category?: string;
  maxPrice?: number;
  duration?: number;
  searchQuery?: string;
}
