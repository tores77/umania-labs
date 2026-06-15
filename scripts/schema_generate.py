#!/usr/bin/env python3
"""
Schema.org JSON-LD Generator for Umania Labs.

Auto-generates high-leverage Schema.org markup for industry verticals.

Usage:
  python3 schema_generate.py --type restaurant --domain ikoya.es --name "Ikoya Izakaya"
  python3 schema_generate.py --type luxury-yacht --domain ourmoment.es
  python3 schema_generate.py --type beach-club --domain beachclub.es
  python3 schema_generate.py --type architecture --domain archdemo.es
  
Output: JSON-LD blocks ready for <head> tag
"""

import json
import sys
import argparse
from datetime import datetime

def schema_restaurant(args):
    """Generate Restaurant schema.org JSON-LD."""
    return {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": args.get('name', 'Restaurant'),
        "url": args.get('url', f"https://{args['domain']}"),
        "description": args.get('description', ''),
        "address": {
            "@type": "PostalAddress",
            "streetAddress": args.get('street_address', ''),
            "addressLocality": args.get('city', ''),
            "addressRegion": args.get('region', ''),
            "postalCode": args.get('postal_code', ''),
            "addressCountry": args.get('country_code', 'ES')
        },
        "telephone": args.get('phone', ''),
        "email": args.get('email', ''),
        "priceRange": args.get('price_range', '$$'),
        "servesCuisine": args.get('cuisines', []),
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": args.get('weekday_open', '12:00'),
                "closes": args.get('weekday_close', '23:00')
            },
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Saturday", "Sunday"],
                "opens": args.get('weekend_open', '12:00'),
                "closes": args.get('weekend_close', '00:00')
            }
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": args.get('rating_value', '4.8'),
            "reviewCount": args.get('review_count', '120')
        } if args.get('has_reviews') else None,
        "image": args.get('image_url', f"https://{args['domain']}/og-image.jpg"),
        "sameAs": args.get('social_urls', []),
        "reservationUrl": args.get('reservation_url', f"https://{args['domain']}/reservaciones")
    }

def schema_luxury_yacht(args):
    """Generate Luxury Yacht Charter schema."""
    return {
        "@context": "https://schema.org",
        "@type": "TouristAttraction",
        "name": args.get('name', 'Luxury Yacht Charter'),
        "url": args.get('url', f"https://{args['domain']}"),
        "description": args.get('description', ''),
        "image": args.get('image_url', f"https://{args['domain']}/og-image.jpg"),
        "address": {
            "@type": "PostalAddress",
            "addressLocality": args.get('city', 'Palma'),
            "addressRegion": args.get('region', 'Islas Baleares'),
            "addressCountry": args.get('country_code', 'ES')
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": args.get('rating_value', '4.9'),
            "reviewCount": args.get('review_count', '450')
        } if args.get('has_reviews') else None,
        "telephone": args.get('phone', ''),
        "email": args.get('email', ''),
        "sameAs": args.get('social_urls', []),
        "priceRange": "$$$$$",
        "offers": {
            "@type": "Offer",
            "priceCurrency": "EUR",
            "price": args.get('price', '5000'),
            "url": args.get('booking_url', f"https://{args['domain']}/book")
        }
    }

def schema_beach_club(args):
    """Generate Beach Club schema."""
    return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": args.get('name', 'Beach Club'),
        "url": args.get('url', f"https://{args['domain']}"),
        "description": args.get('description', ''),
        "image": args.get('image_url', f"https://{args['domain']}/og-image.jpg"),
        "address": {
            "@type": "PostalAddress",
            "streetAddress": args.get('street_address', ''),
            "addressLocality": args.get('city', ''),
            "addressRegion": args.get('region', ''),
            "postalCode": args.get('postal_code', ''),
            "addressCountry": args.get('country_code', 'ES'),
            "latitude": args.get('latitude', '39.5'),
            "longitude": args.get('longitude', '2.5')
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": args.get('latitude', '39.5'),
            "longitude": args.get('longitude', '2.5')
        },
        "telephone": args.get('phone', ''),
        "email": args.get('email', ''),
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "opens": args.get('opens', '10:00'),
                "closes": args.get('closes', '23:00')
            }
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": args.get('rating_value', '4.7'),
            "reviewCount": args.get('review_count', '350')
        } if args.get('has_reviews') else None,
        "priceRange": "$$$",
        "sameAs": args.get('social_urls', [])
    }

def schema_hotel(args):
    """Generate Hotel/Hospitality schema."""
    return {
        "@context": "https://schema.org",
        "@type": "Hotel",
        "name": args.get('name', 'Hotel'),
        "url": args.get('url', f"https://{args['domain']}"),
        "description": args.get('description', ''),
        "image": args.get('image_url', f"https://{args['domain']}/og-image.jpg"),
        "address": {
            "@type": "PostalAddress",
            "streetAddress": args.get('street_address', ''),
            "addressLocality": args.get('city', ''),
            "addressRegion": args.get('region', ''),
            "postalCode": args.get('postal_code', ''),
            "addressCountry": args.get('country_code', 'ES')
        },
        "telephone": args.get('phone', ''),
        "email": args.get('email', ''),
        "starRating": {
            "@type": "Rating",
            "ratingValue": args.get('star_rating', '5')
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": args.get('rating_value', '4.8'),
            "reviewCount": args.get('review_count', '500')
        } if args.get('has_reviews') else None,
        "priceRange": args.get('price_range', '$$$$'),
        "checkinTime": "15:00",
        "checkoutTime": "11:00",
        "amenityFeature": args.get('amenities', []),
        "sameAs": args.get('social_urls', [])
    }

def schema_architecture(args):
    """Generate Architecture/Design Studio schema."""
    return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": args.get('name', 'Architecture Studio'),
        "url": args.get('url', f"https://{args['domain']}"),
        "description": args.get('description', ''),
        "image": args.get('image_url', f"https://{args['domain']}/og-image.jpg"),
        "address": {
            "@type": "PostalAddress",
            "streetAddress": args.get('street_address', ''),
            "addressLocality": args.get('city', 'Palma'),
            "addressRegion": args.get('region', 'Islas Baleares'),
            "postalCode": args.get('postal_code', ''),
            "addressCountry": args.get('country_code', 'ES')
        },
        "telephone": args.get('phone', ''),
        "email": args.get('email', ''),
        "priceRange": "$$$$",
        "areaServed": args.get('service_areas', []),
        "knowsAbout": args.get('expertise', ["Architecture", "Interior Design", "Sustainable Design"]),
        "sameAs": args.get('social_urls', []),
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": args.get('rating_value', '4.9'),
            "reviewCount": args.get('review_count', '80')
        } if args.get('has_reviews') else None
    }

def schema_fashion(args):
    """Generate Fashion/Luxury Brand schema."""
    return {
        "@context": "https://schema.org",
        "@type": "Brand",
        "name": args.get('name', 'Fashion Brand'),
        "url": args.get('url', f"https://{args['domain']}"),
        "description": args.get('description', ''),
        "logo": args.get('logo_url', f"https://{args['domain']}/logo.png"),
        "image": args.get('image_url', f"https://{args['domain']}/og-image.jpg"),
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Service",
            "telephone": args.get('phone', ''),
            "email": args.get('email', '')
        },
        "sameAs": args.get('social_urls', []),
        "founder": args.get('founder', ''),
        "foundingDate": args.get('founding_year', '2024'),
        "areaServed": args.get('service_areas', ['ES']),
        "award": args.get('awards', [])
    }

SCHEMA_TYPES = {
    'restaurant': schema_restaurant,
    'luxury-yacht': schema_luxury_yacht,
    'beach-club': schema_beach_club,
    'hotel': schema_hotel,
    'hospitality': schema_hotel,
    'architecture': schema_architecture,
    'fashion': schema_fashion,
}

def main():
    parser = argparse.ArgumentParser(description='Generate Schema.org JSON-LD')
    parser.add_argument('--type', required=True, choices=list(SCHEMA_TYPES.keys()),
                       help='Schema type')
    parser.add_argument('--domain', required=True, help='Domain name')
    parser.add_argument('--name', help='Business/property name')
    parser.add_argument('--description', help='Description')
    parser.add_argument('--city', help='City')
    parser.add_argument('--region', help='Region')
    parser.add_argument('--country-code', default='ES', help='Country code (default: ES)')
    parser.add_argument('--phone', help='Phone number')
    parser.add_argument('--email', help='Email address')
    parser.add_argument('--price-range', help='Price range ($-$$$$$)')
    parser.add_argument('--rating', default='4.8', help='Rating (1-5)')
    parser.add_argument('--reviews', default='100', help='Review count')
    parser.add_argument('--image-url', help='OG image URL')
    parser.add_argument('--json', action='store_true', help='Output raw JSON')
    
    args = parser.parse_args()
    
    if args.type not in SCHEMA_TYPES:
        print(f"ERROR: Unknown type '{args.type}'", file=sys.stderr)
        print(f"Available: {', '.join(SCHEMA_TYPES.keys())}", file=sys.stderr)
        sys.exit(1)
    
    schema_gen = SCHEMA_TYPES[args.type]
    
    kwargs = {
        'domain': args.domain,
        'name': args.name or args.domain,
        'description': args.description or '',
        'city': args.city or '',
        'region': args.region or '',
        'country_code': args.country_code,
        'phone': args.phone or '',
        'email': args.email or '',
        'price_range': args.price_range or '$$',
        'rating_value': args.rating,
        'review_count': args.reviews,
        'image_url': args.image_url or f"https://{args.domain}/og-image.jpg",
        'has_reviews': True
    }
    
    schema = schema_gen(kwargs)
    
    # Remove None values
    schema = {k: v for k, v in schema.items() if v is not None}
    
    if args.json:
        print(json.dumps(schema, indent=2, ensure_ascii=False))
    else:
        print("<!-- Schema.org JSON-LD for " + schema.get('name', 'your business') + " -->")
        print("<script type=\"application/ld+json\">")
        print(json.dumps(schema, indent=2, ensure_ascii=False))
        print("</script>")
        print()
        print(f"✓ Generated {args.type} schema for {args.domain}")
        print(f"✓ Copy the <script> tag above into your <head>")
        print(f"✓ Validate at: https://schema.org/validate")

if __name__ == "__main__":
    main()
