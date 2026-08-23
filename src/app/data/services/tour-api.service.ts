import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TourDto } from '../dto/tour.dto';

const MOCK_TOURS: TourDto[] = [
  {
    id: 'kmt-01',
    title: 'The Pharaohs Sanctuary: Private Giza & Dahshur VIP Access',
    slug: 'pharaohs-sanctuary-giza-dahshur',
    tagline: 'Private after-hours access inside the Great Pyramid with an Egyptologist.',
    description: 'Walk in the footsteps of ancient royalty. Experience exclusive after-hours access inside Khufus burial chamber and the Great Sphinx enclosure, accompanied by a world-renowned Egyptologist.',
    category: 'historical',
    duration_days: 3,
    price_usd: 1850,
    rating_score: 4.98,
    reviews_count: 142,
    max_group_size: 6,
    featured_image_url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: [
      'Private night entry to Khufu Pyramid interior',
      'Private access between the paws of the Great Sphinx',
      'Grand Egyptian Museum VIP tour with private curator',
      '5-Star luxury suite overlooking the Pyramids'
    ],
    city: 'Giza & Cairo',
    country: 'Egypt',
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Royal Welcome at The Mena House',
        description: 'Private airport escort in luxury vehicle, welcome cocktail, and orientation with chief Egyptologist.',
        activities: ['Airport VIP transfer', 'Evening welcome banquet with Nile views'],
        meals: ['Dinner']
      },
      {
        day: 2,
        title: 'Exclusive Pyramids Plateau & The Sphinx Enclosure',
        description: 'Sunrise exploration and after-hours private entry to Khufus interior chamber.',
        activities: ['Sphinx paws private blessing', 'Pyramid interior private access', 'Sunset camel ride across dunes'],
        meals: ['Breakfast', 'Lunch', 'Dinner']
      },
      {
        day: 3,
        title: 'The Grand Egyptian Museum Curators Tour',
        description: 'Private guided walkthrough of King Tutankhamuns complete treasure galleries before public hours.',
        activities: ['VIP GEM walkthrough', 'Farewell lunch at Pyramids lounge'],
        meals: ['Breakfast', 'Lunch']
      }
    ],
    included_items: ['Luxury 5-Star accommodation', 'Private chauffeured Mercedes S-Class', 'All VIP entrance fees', 'All gourmet meals'],
    excluded_items: ['International flights', 'Personal travel insurance'],
    is_featured: true,
    badge_label: 'Signature Experience'
  },
  {
    id: 'kmt-02',
    title: 'The Royal Dahabiya: Luxury Nile Voyage from Luxor to Aswan',
    slug: 'royal-dahabiya-luxury-nile',
    tagline: 'Sail timeless waters on a handcrafted private wooden Dahabiya yacht.',
    description: 'Immerse yourself in timeless luxury as you glide past ancient temples and riverbanks unchanged for millennia aboard an exclusive sail Dahabiya with a dedicated chef.',
    category: 'luxury-nile',
    duration_days: 6,
    price_usd: 3400,
    rating_score: 4.96,
    reviews_count: 98,
    max_group_size: 10,
    featured_image_url: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1544885935-98dd03b09034?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: [
      'Luxor & Karnak Temple sunrise private blessing',
      'Valley of the Kings: Seti I & Tutankhamun tomb access',
      'Candlelit dinner on an uninhabited Nile island',
      'Philae Island Temple of Isis at twilight'
    ],
    city: 'Luxor to Aswan',
    country: 'Egypt',
    itinerary: [
      {
        day: 1,
        title: 'Luxor: The City of Living Gods',
        description: 'Embarkation on the private Dahabiya followed by Karnak Temple evening illumination.',
        activities: ['Yacht check-in', 'Private Karnak tour'],
        meals: ['Lunch', 'Dinner']
      },
      {
        day: 2,
        title: 'The Theban Necropolis & Queens',
        description: 'Valley of the Kings and Queens with royal tomb master tickets.',
        activities: ['Nefertari tomb entry', 'Seti I tomb exploration'],
        meals: ['Breakfast', 'Lunch', 'Dinner']
      }
    ],
    included_items: ['Full board Dahabiya luxury cabin', 'Private Egyptologist guide', 'Private transfers', 'All admissions'],
    excluded_items: ['Gratuities', 'Alcoholic vintage selections'],
    is_featured: true,
    badge_label: 'Best Seller'
  },
  {
    id: 'kmt-03',
    title: 'Siwa Oasis & White Desert Stargazing Odyssey',
    slug: 'siwa-oasis-white-desert-safari',
    tagline: 'Surreal limestone monoliths and turquoise salt lakes in the Great Sand Sea.',
    description: 'Discover Egypts most remote paradise: crystal salt springs of Siwa, oracle temple of Alexander the Great, and luxury glamping under the Milky Way in the White Desert.',
    category: 'desert-safari',
    duration_days: 5,
    price_usd: 2100,
    rating_score: 4.92,
    reviews_count: 64,
    max_group_size: 8,
    featured_image_url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    gallery_urls: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
    ],
    highlights: [
      'Floating in turquoise Siwa natural salt pools',
      'Campfire stargazing in luxury Bedouin tented camp',
      'Temple of the Oracle where Alexander became Pharaoh',
      'Sandboarding on 100m dunes in the Great Sand Sea'
    ],
    city: 'Siwa & Western Desert',
    country: 'Egypt',
    itinerary: [
      {
        day: 1,
        title: 'Cairo to Siwa Scenic Expedition',
        description: 'Traverse the dramatic desert road in customized 4x4 overland vehicles.',
        activities: ['Desert landscape stops', 'Arrival in eco-lodge oasis'],
        meals: ['Lunch', 'Dinner']
      }
    ],
    included_items: ['Eco-lodge and desert glamping stay', '4x4 desert transport', 'All meals & refreshments', 'Bedouin guides'],
    excluded_items: ['Personal equipment', 'Tips'],
    is_featured: true,
    badge_label: 'Adventure Luxury'
  },
  {
    id: 'kmt-04',
    title: 'Red Sea Deep Blue: Private Yacht & Ras Mohammed Marine Expedition',
    slug: 'red-sea-marine-expedition',
    tagline: 'Pristine coral reefs, sunken wrecks, and ultra-luxury seaside retreats.',
    description: 'Charter a private yacht along the Sinai coast, diving into legendary reefs and protected marine reserves with marine biologists.',
    category: 'diving',
    duration_days: 4,
    price_usd: 2450,
    rating_score: 4.95,
    reviews_count: 73,
    max_group_size: 6,
    featured_image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    gallery_urls: [],
    highlights: [
      'Private yacht charter in Ras Mohammed National Park',
      'Night diving with bioluminescence',
      'Luxury overwater villa in El Gouna'
    ],
    city: 'Sharm El Sheikh & El Gouna',
    country: 'Egypt',
    itinerary: [],
    included_items: ['Private yacht charter', 'Master dive instructors', 'Luxury resort stay'],
    excluded_items: ['Equipment purchase'],
    is_featured: false,
    badge_label: 'Exclusive'
  }
];

@Injectable({
  providedIn: 'root',
})
export class TourApiService {
  private readonly http = inject(HttpClient);

  getTours(): Observable<TourDto[]> {
    // In production this calls: this.http.get<TourDto[]>('/api/v1/tours')
    return of(MOCK_TOURS).pipe(delay(200));
  }

  getTourById(id: string): Observable<TourDto | undefined> {
    const found = MOCK_TOURS.find((t) => t.id === id || t.slug === id);
    return of(found).pipe(delay(150));
  }
}
