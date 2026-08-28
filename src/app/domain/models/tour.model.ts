

export interface TourPlanDay {
  day: number;
  title: string;
  description: Array<{
    headline: string;
    details: string;
  }>;
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
  duration: number;
  durationType: string;
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
  tours_plan: TourPlanDay[];
  included: string[];
  excluded: string[];
  isFeatured: boolean;
  sub_type?: string;
  badge?: string;
}

export interface TourFilterOptions {
  category?: string;
  maxPrice?: number;
  duration?: number;
  searchQuery?: string;
  sub_type?: string;
  destination?: string;
  tour_type?: string;
}
