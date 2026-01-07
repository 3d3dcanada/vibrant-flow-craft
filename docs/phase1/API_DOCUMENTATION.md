# Phase 1 API Documentation

## Overview

This document describes the API endpoints available for the 3D3D Canada platform Phase 1 vertical slice.

## Base URLs

| Environment | URL |
|-------------|-----|
| Production | `https://your-project.supabase.co` |
| Staging | `https://your-staging-project.supabase.co` |
| Local | `http://localhost:54321` |

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

For Edge Functions, also include the anon key:

```
apikey: <anon_key>
```

---

## Edge Functions

### POST /functions/v1/calculate-quote

Calculate a quote for a 3D print job with transparent pricing breakdown.

**Headers:**
```
Authorization: Bearer <anon_key> (or user token for authenticated quotes)
Content-Type: application/json
```

**Request Body:**
```json
{
  "file_metadata": {
    "volume_cm3": 125.5,
    "surface_area_cm2": 450.2,
    "bounding_box": { "x": 50, "y": 50, "z": 100 }
  },
  "material": "PLA_STANDARD",
  "quality": "standard",
  "quantity": 1,
  "color": "black",
  "delivery_speed": "standard",
  "post_processing": {
    "enabled": false
  }
}
```

**Alternative (manual gram input):**
```json
{
  "grams": 125,
  "material": "PLA_STANDARD",
  "quality": "standard",
  "quantity": 1,
  "delivery_speed": "standard"
}
```

**Response (200 OK):**
```json
{
  "quote_id": "550e8400-e29b-41d4-a716-446655440000",
  "expires_at": "2026-01-14T15:00:00Z",
  "breakdown": {
    "platform_fee": 5.00,
    "bed_rental": 10.00,
    "filament_cost": 11.25,
    "post_processing": 0.00,
    "extended_time_surcharge": 0.00,
    "rush_surcharge": 0.00,
    "quantity_discount": 0.00,
    "subtotal": 26.25,
    "minimum_adjustment": 0.00,
    "total": 26.25,
    "total_credits": 263
  },
  "maker_payout": {
    "bed_rental": 10.00,
    "material_share": 7.50,
    "post_processing_share": 0.00,
    "total": 17.50
  },
  "designer_royalty": 0.25,
  "estimated_print_time_hours": 4.5,
  "dfm_warnings": []
}
```

**Error Responses:**

| Status | Description |
|--------|-------------|
| 400 | Invalid input parameters |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

**Available Materials:**
- `PLA_STANDARD` - PLA Standard ($0.09/g)
- `PLA_SPECIALTY` - PLA Specialty ($0.14/g)
- `PETG` - PETG ($0.11/g)
- `PETG_CF` - PETG Carbon Fiber ($0.35/g)
- `TPU` - TPU Flexible ($0.18/g)
- `ABS_ASA` - ABS/ASA ($0.13/g)

**Quality Options:**
- `draft` - Fastest, lower quality
- `standard` - Balanced (default)
- `high` - Highest quality, slower

**Delivery Speed:**
- `standard` - No surcharge
- `emergency` - 15-25% rush surcharge on eligible items

---

## REST API Endpoints

### GET /rest/v1/quotes

Retrieve user's quotes.

**Headers:**
```
Authorization: Bearer <user_token>
apikey: <anon_key>
```

**Query Parameters:**
| Parameter | Description | Example |
|-----------|-------------|---------|
| user_id | Filter by user ID | `eq.uuid` |
| status | Filter by status | `eq.active` |
| order | Order results | `created_at.desc` |
| limit | Maximum results | `10` |

**Example Request:**
```
GET /rest/v1/quotes?user_id=eq.{user_id}&status=eq.active&order=created_at.desc&limit=10
```

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "file_name": "model.stl",
    "material": "PLA_STANDARD",
    "quantity": 1,
    "total_cad": 26.25,
    "total_credits": 263,
    "created_at": "2026-01-07T14:00:00Z",
    "expires_at": "2026-01-14T14:00:00Z",
    "status": "active"
  }
]
```

---

### POST /rest/v1/print_requests

Create a print request from a saved quote.

**Headers:**
```
Authorization: Bearer <user_token>
apikey: <anon_key>
Content-Type: application/json
Prefer: return=representation
```

**Request Body:**
```json
{
  "quote_id": "550e8400-e29b-41d4-a716-446655440000",
  "file_url": "https://storage.supabase.co/...",
  "notes": "Please use black filament",
  "shipping_address": {
    "line1": "123 Main St",
    "city": "Toronto",
    "province": "ON",
    "postal_code": "M5V 3A8"
  }
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "quote_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "created_at": "2026-01-07T15:00:00Z"
}
```

---

### GET /rest/v1/point_transactions

Retrieve user's point transaction history.

**Headers:**
```
Authorization: Bearer <user_token>
apikey: <anon_key>
```

**Query Parameters:**
| Parameter | Description | Example |
|-----------|-------------|---------|
| user_id | Filter by user ID | `eq.uuid` |
| activity_type | Filter by activity | `eq.signup_bonus` |
| order | Order results | `created_at.desc` |

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "activity_type": "signup_bonus",
    "points": 100,
    "description": "Welcome bonus for joining 3D3D Canada!",
    "balance_after": 100,
    "verification_status": "verified",
    "created_at": "2026-01-07T12:00:00Z"
  }
]
```

---

## Pricing Model Reference

### Core Pricing (Fixed)
```
Minimum Order = $18 CAD
├── Platform Fee (3D3D): $5.00 (includes $0.25 designer royalty)
├── Bed Rental (Maker): $10.00 minimum
└── Filament Minimum: $3.00
```

### Credit Economy
```
10 credits = $1 CAD
1 credit = $0.10 CAD
```

### Bed Rental Tiers
| Print Time | Rate |
|------------|------|
| 0-6 hours | $10.00 |
| 6-24 hours | $14.00 |
| 24+ hours | $18.00 + $1/hr |

### Quantity Discounts
| Quantity | Discount |
|----------|----------|
| 10+ units | 10% off |
| 25+ units | 15% off |
| 50+ units | 20% off |

---

## TypeScript Types

```typescript
type MaterialType = 
  | 'PLA_STANDARD' 
  | 'PLA_SPECIALTY' 
  | 'PETG' 
  | 'PETG_CF' 
  | 'TPU' 
  | 'ABS_ASA';

type Quality = 'draft' | 'standard' | 'high';
type DeliverySpeed = 'standard' | 'emergency';

interface QuoteRequest {
  file_metadata?: {
    volume_cm3: number;
    surface_area_cm2: number;
    bounding_box: { x: number; y: number; z: number };
  };
  grams?: number;
  material: MaterialType;
  quality: Quality;
  quantity: number;
  color?: string;
  post_processing?: {
    enabled: boolean;
    tier?: 'standard' | 'advanced';
    minutes?: number;
  };
  delivery_speed: DeliverySpeed;
}

interface QuoteResponse {
  quote_id: string;
  expires_at: string;
  breakdown: PriceBreakdown;
  maker_payout: MakerPayout;
  designer_royalty: number;
  estimated_print_time_hours: number;
  dfm_warnings?: string[];
}
```

---

## Error Handling

All error responses follow this format:

```json
{
  "error": "Human-readable error message",
  "details": "Optional technical details"
}
```

| HTTP Status | Meaning |
|-------------|---------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

*API Documentation — Phase 1 Vertical Slice — January 2026*
