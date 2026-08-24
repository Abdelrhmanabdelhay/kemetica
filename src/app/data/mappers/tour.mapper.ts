import { Tour } from '../../domain/models/tour.model';
import { TourDto } from '../dto/tour.dto';

export class TourMapper {
  static fromDto(dto: TourDto): Tour {
    const prependUrl = (url: string | undefined) => {
      if (!url) return '';
      if (url.startsWith('http')) return url;
      return url.startsWith('/') ? `http://localhost:3000${url}` : `http://localhost:3000/${url}`;
    };

    return {
      id: dto.id,
      title: dto.title,
      slug: dto.slug,
      tagline: dto.tagline,
      description: dto.description,
      category: dto.category,
      durationDays: dto.duration_days,
      price: dto.price_usd,
      currency: 'USD',
      rating: dto.rating_score,
      reviewCount: dto.reviews_count,
      groupSizeMax: dto.max_group_size,
      featuredImage: prependUrl(dto.featured_image_url),
      galleryImages: (dto.gallery_urls || []).map(prependUrl),
      highlights: dto.highlights || [],
      location: {
        city: dto.city,
        country: dto.country,
      },
      itinerary: (dto.itinerary || []).map((item) => ({
        dayNumber: item.day,
        title: item.title,
        description: item.description,
        activities: item.activities,
        mealsIncluded: item.meals,
      })),
      included: dto.included_items || [],
      notIncluded: dto.excluded_items || [],
      isFeatured: !!dto.is_featured,
      badge: dto.badge_label,
    };
  }

  static fromDtoList(dtos: TourDto[]): Tour[] {
    return dtos.map((dto) => this.fromDto(dto));
  }
}
