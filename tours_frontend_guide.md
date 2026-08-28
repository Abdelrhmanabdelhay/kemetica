# Kemetica — Tours API Frontend Guide

> **Base URL:** `http://localhost:3000/api/v1`  
> All responses follow the shape: `{ status, message, results, data }`

---

## 1. Tour Model — Key Fields

| Field | Type | Values | Purpose |
|-------|------|--------|---------|
| `tour_type` | String | `special` `popular` `exclusive` `standard` `new` | `special` = **cover image only**, never shown in listings |
| `sub_type` | String | `gold` `cruise` `transfer` `standard` | The **browsable tab filter** per destination |
| `destination` | String | `giza` `luxor` `aswan` | Which destination this tour belongs to |
| `is_featured` | Boolean | `true` / `false` | Pinned to top of results |
| `slug` | String | e.g. `aswan-felucca` | Use for routing: `/tours/aswan-felucca` |

---

## 2. The Two-Level System

```
Destination Page (e.g. Aswan)
├── COVER IMAGE  →  GET /tours/special?destination=aswan
│                   Returns the single hero image for the page top
│
└── TOUR LISTING TABS
    ├── [Gold]     →  GET /tours?destination=aswan&sub_type=gold
    ├── [Cruise]   →  GET /tours?destination=aswan&sub_type=cruise
    └── [Transfer] →  GET /tours?destination=aswan&sub_type=transfer
```

> **Rule:** `special` tours are **never** returned by `GET /tours`. They are **only** returned by `GET /tours/special`.

---

## 3. API Endpoints

### 3.1 — Cover / Hero Image per Destination

```
GET /tours/special?destination=aswan
GET /tours/special?destination=luxor
GET /tours/special?destination=giza
```

**Returns:** 1 tour object used as the destination cover image.

**Use on:** Top of the destination page or any cover card section.

**Example response:**
```json
{
  "status": "success",
  "data": [{
    "_id": "...",
    "title": "Aswan Philae Temple at Night",
    "featured_image_url": "/cover-special/aswan.jpg",
    "tagline": "Witness the magic of Philae Temple.",
    "destination": "aswan",
    "tour_type": "special"
  }]
}
```

---

### 3.2 — All Tours for a Destination (no special)

```
GET /tours?destination=aswan
GET /tours?destination=luxor
GET /tours?destination=giza
```

**Returns:** All 6 regular tours (2 gold + 2 cruise + 2 transfer). Special tours are automatically excluded.

**Sorted by:** `is_featured` desc, then `rating_score` desc.

---

### 3.3 — Tours by Sub-Type (Tab Filtering)

```
GET /tours?destination=aswan&sub_type=gold
GET /tours?destination=aswan&sub_type=cruise
GET /tours?destination=aswan&sub_type=transfer
```

**Use on:** When the user clicks the Gold / Cruise / Transfer tab button.

**Returns:** 2 tours matching the destination + sub_type combination.

---

### 3.4 — Single Tour Detail

```
GET /tours/:slugOrId
```

**Examples:**
```
GET /tours/aswan-felucca
GET /tours/64abc123def456
```

**Returns:** Full tour object with category populated.

---

### 3.5 — Featured Tours (Home Page)

```
GET /tours/featured
```

**Returns:** Up to 6 tours where `is_featured: true`, sorted by rating.

---

### 3.6 — Search & Filter (General)

```
GET /tours?q=felucca
GET /tours?destination=aswan&sub_type=cruise&q=sunset
GET /tours?maxPrice=200
```

| Query Param | Type | Description |
|-------------|------|-------------|
| `destination` | String | `giza` `luxor` `aswan` |
| `sub_type` | String | `gold` `cruise` `transfer` |
| `tour_type` | String | Override type filter (rarely needed) |
| `maxPrice` | Number | Max price in USD |
| `q` | String | Full-text search on title, tagline, description |
| `category` | String | Category name, e.g. `historical` `cultural` |

---

## 4. Page-by-Page Implementation Guide

### 4.1 — Home Page (Cover Section)

Fetch all three cover images to build the special tours hero carousel:

```ts
// Fetch all 3 destination covers in parallel
const [gizaCover, luxorCover, aswanCover] = await Promise.all([
  fetch('/api/v1/tours/special?destination=giza'),
  fetch('/api/v1/tours/special?destination=luxor'),
  fetch('/api/v1/tours/special?destination=aswan'),
]);
```

Use `featured_image_url` as the background, `tagline` as the subtitle, `destination` for the link.

---

### 4.2 — Tours Listing Page (`/tours`)

**Step 1:** On page load, show all tours (no destination filter):
```
GET /tours
```

**Step 2:** When user selects destination → re-fetch:
```
GET /tours?destination=aswan
```

**Step 3:** When user clicks sub-type tab → re-fetch:
```
GET /tours?destination=aswan&sub_type=gold
```

**Recommended tab UI per destination:**

```
[ Gold ]  [ Cruise ]  [ Transfer ]
```

Map `sub_type` to display labels:

```ts
const subTypeLabels = {
  gold: '🥇 Gold',
  cruise: '🚢 Cruise',
  transfer: '🚌 Transfer',
};
```

---

### 4.3 — Destination Detail Page (`/destinations/aswan`)

**Step 1 — Load the cover:**
```
GET /tours/special?destination=aswan
→ Use data[0].featured_image_url as the hero background
→ Use data[0].tagline as the hero subtitle
```

**Step 2 — Load Gold tours by default (first tab active):**
```
GET /tours?destination=aswan&sub_type=gold
```

**Step 3 — On tab click, switch sub_type:**
```
GET /tours?destination=aswan&sub_type=cruise
GET /tours?destination=aswan&sub_type=transfer
```

**Complete Angular/TypeScript example:**

```ts
selectedSubType: 'gold' | 'cruise' | 'transfer' = 'gold';
coverTour: any = null;
tours: any[] = [];

ngOnInit() {
  // Load cover image
  this.http.get('/api/v1/tours/special?destination=aswan')
    .subscribe((res: any) => this.coverTour = res.data[0]);

  // Load default tab (Gold)
  this.loadTours();
}

loadTours() {
  const url = `/api/v1/tours?destination=aswan&sub_type=${this.selectedSubType}`;
  this.http.get(url).subscribe((res: any) => this.tours = res.data);
}

onTabChange(subType: 'gold' | 'cruise' | 'transfer') {
  this.selectedSubType = subType;
  this.loadTours();
}
```

---

### 4.4 — Tour Detail Page (`/tours/:slug`)

```
GET /tours/aswan-felucca
```

The response includes the fully populated `category` object.

---

## 5. Tour Object Shape

```json
{
  "_id": "64abc...",
  "title": "Aswan Felucca Sunset Sail",
  "slug": "aswan-felucca",
  "tagline": "Sail the Nile the traditional way.",
  "description": "A relaxing sunset sail...",
  "destination": "aswan",
  "city": "Aswan",
  "country": "Egypt",
  "tour_type": "popular",
  "sub_type": "cruise",
  "is_featured": false,
  "duration_days": 1,
  "max_group_size": 8,
  "rating_score": 0,
  "reviews_count": 0,
  "featured_image_url": "https://...",
  "gallery_urls": ["https://..."],
  "highlights": ["Traditional Felucca", "Elephantine Island", "Sunset views"],
  "included_items": [],
  "excluded_items": [],
  "itinerary": [],
  "category": {
    "_id": "...",
    "name": "Cultural",
    "description": "..."
  },
  "createdAt": "2026-08-27T...",
  "updatedAt": "2026-08-27T..."
}
```

---

## 6. Quick Reference

```
HOME COVER IMAGES:
  GET /tours/special?destination=giza
  GET /tours/special?destination=luxor
  GET /tours/special?destination=aswan

DESTINATION PAGE — Default (Gold tab):
  GET /tours?destination=aswan&sub_type=gold

DESTINATION PAGE — Tab switch:
  GET /tours?destination=aswan&sub_type=cruise
  GET /tours?destination=aswan&sub_type=transfer

ALL TOURS (no filter):
  GET /tours

FEATURED (home section):
  GET /tours/featured

SINGLE TOUR:
  GET /tours/:slug
  GET /tours/:id

SEARCH:
  GET /tours?q=felucca
  GET /tours?destination=aswan&q=sunset&sub_type=cruise
```

---

> **Note:** The `special` tour for each destination is purely a cover image. Do **not** render it in the tours listing grid. Only use `featured_image_url` and `tagline` from it.
