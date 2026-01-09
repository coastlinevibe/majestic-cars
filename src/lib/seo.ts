// SEO utilities for structured data and meta tags

export interface CarData {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  image: string;
  description: string;
  location: string;
  url: string;
}

// Generate JSON-LD structured data for a car listing
export const generateCarSchema = (car: CarData) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: car.name,
    brand: {
      '@type': 'Brand',
      name: car.make,
    },
    model: car.model,
    productionDate: `${car.year}`,
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: car.mileage,
      unitCode: 'KMT',
    },
    fuelType: car.fuel,
    image: car.image,
    description: car.description,
    offers: {
      '@type': 'Offer',
      price: car.price,
      priceCurrency: 'ZAR',
      availability: 'https://schema.org/InStock',
      url: car.url,
    },
    areaServed: {
      '@type': 'Place',
      name: car.location,
    },
  };
};

// Generate JSON-LD for organization
export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Majestic Cars',
    image: 'https://majestic-cars.vercel.app/website logo.png',
    description: 'Simple, honest, and stress-free car buying. Quality second-hand cars with fair prices and full inspections.',
    url: 'https://majestic-cars.vercel.app',
    telephone: '0608579146',
    email: 'majesticcarssinoville@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '153 Sefako Makgatho Service Ln',
      addressLocality: 'Sinoville',
      addressRegion: 'Pretoria',
      postalCode: '0129',
      addressCountry: 'ZA',
    },
    sameAs: [
      'https://facebook.com',
      'https://twitter.com',
      'https://instagram.com',
    ],
    priceRange: 'R50000 - R5000000',
  };
};

// Generate JSON-LD for search results (BreadcrumbList)
export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

// Generate JSON-LD for inventory/collection
export const generateCollectionSchema = (cars: CarData[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Car Inventory',
    description: 'Browse our collection of quality second-hand cars',
    url: 'https://majestic-cars.vercel.app/inventory',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: cars.slice(0, 10).map((car, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Car',
          name: car.name,
          image: car.image,
          offers: {
            '@type': 'Offer',
            price: car.price,
            priceCurrency: 'ZAR',
          },
        },
      })),
    },
  };
};

// Set meta tags dynamically
export const setMetaTags = (tags: Record<string, string>) => {
  Object.entries(tags).forEach(([key, value]) => {
    let element = document.querySelector(`meta[name="${key}"]`) ||
                  document.querySelector(`meta[property="${key}"]`);
    
    if (!element) {
      element = document.createElement('meta');
      if (key.startsWith('og:')) {
        element.setAttribute('property', key);
      } else {
        element.setAttribute('name', key);
      }
      document.head.appendChild(element);
    }
    
    element.setAttribute('content', value);
  });
};

// Set page title
export const setPageTitle = (title: string) => {
  document.title = title;
  setMetaTags({
    'og:title': title,
    'twitter:title': title,
  });
};

// Set page description
export const setPageDescription = (description: string) => {
  setMetaTags({
    'description': description,
    'og:description': description,
    'twitter:description': description,
  });
};

// Set page image for social sharing
export const setPageImage = (imageUrl: string) => {
  // Ensure absolute URL for social sharing
  const absoluteUrl = imageUrl.startsWith('http') 
    ? imageUrl 
    : `https://majestic-cars.vercel.app${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
  
  setMetaTags({
    'og:image': absoluteUrl,
    'twitter:image': absoluteUrl,
    'og:image:secure_url': absoluteUrl,
  });
};

// Add JSON-LD script to head
export const addJsonLd = (schema: any) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
};

// Clean up old JSON-LD scripts
export const clearJsonLd = () => {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  scripts.forEach((script) => {
    if (script.textContent && !script.textContent.includes('Organization')) {
      script.remove();
    }
  });
};
