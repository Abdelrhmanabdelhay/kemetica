export interface TourLocation {
  city: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

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

export interface Tour {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  category: 'historical' | 'luxury-nile' | 'desert-safari' | 'cultural' | 'diving';
  durationDays: number;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  groupSizeMax: number;
  featuredImage: string;
  galleryImages: string[];
  highlights: string[];
  location: TourLocation;
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
