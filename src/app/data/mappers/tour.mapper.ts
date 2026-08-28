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
      category: {
        id: dto.category._id,
        name: dto.category.name,
        description: dto.category.description,
        isActive: dto.category.is_active,
        displayOrder: dto.category.display_order,
      },
      duration: dto.duration || dto.duration_days || 1,
      durationType: dto.duration_type || 'Days',
      price: dto.price_usd,
      currency: 'USD',
      rating: dto.rating_score,
      reviewCount: dto.reviews_count,
      groupSizeMax: dto.max_group_size,
      featuredImage: prependUrl(dto.featured_image_url),
      galleryImages: (dto.gallery_urls || []).map(prependUrl),
      highlights: dto.highlights || [],
      city: dto.city,
      country: dto.country,
      tours_plan: (dto.tours_plan || []).map((item) => ({
        day: item.day,
        title: item.title,
        description: item.description || [],
      })),
      included: dto.included || [],
      excluded: dto.excluded || [],
      isFeatured: !!dto.is_featured,
      badge: dto.badge_label,
    };
  }

  static fromDtoList(dtos: TourDto[]): Tour[] {
    return dtos.map((dto) => this.fromDto(dto));
  }
}
