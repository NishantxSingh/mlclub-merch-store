export const PRODUCTS = [
  {
    id: '1',
    name: 'Techie Hoodie',
    price: 829,
    category: 'apparel',
    colors: ['Black', 'Grey'],
    description: 'Our signature heavy-blend hoodie. Featuring the classic ML Club logo on the front. Perfect for late-night coding sessions.',
    image: '/hoodie.png', // Default image
    images: {
      'Black': '/hoodie-black.png', // Add these specific images to your static folder
      'Grey': '/hoodie-grey.png'
    }
  },
  {
    id: '2',
    name: 'ML T_Shirt',
    price: 499,
    category: 'apparel',
    colors: ['Black', 'Navy Blue'],
    description: 'Premium 100% cotton t-shirt featuring a custom topographic gradient descent visualization. Show off your ML Club pride.',
    image: '/tshirt.png',
    images: {
      'Black': '/tshirt-black.png',
      'Navy Blue': '/tshirt-navy.png'
    }
  }
];