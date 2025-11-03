import type { Product } from "./types"

export const products: Product[] = [
  {
    id: 1,
    name: "Oguishi Soup",
    category: "african",
    price: 85000,
    image: "/african-oguishi-soup.jpg",
    description: "Traditional African soup with rich flavors and fresh ingredients",
    longDescription:
      "Our signature Oguishi Soup is a traditional African delicacy made with fresh vegetables, spices, and your choice of protein. Served with fufu or rice for a complete meal.",
    addOns: [
      { id: 1, name: "Extra Meat", price: 15000 },
      { id: 2, name: "Extra Fish", price: 12000 },
      { id: 3, name: "Fufu", price: 10000 },
    ],
    featured: true,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: 2,
    name: "Jollof Rice",
    category: "african",
    price: 65000,
    image: "/jollof-rice-chicken.png",
    description: "Classic West African jollof rice with chicken and vegetables",
    longDescription:
      "Our famous Jollof Rice is cooked to perfection with tomatoes, peppers, and aromatic spices. Served with tender chicken and a side of fried plantains.",
    addOns: [
      { id: 4, name: "Extra Chicken", price: 18000 },
      { id: 5, name: "Fried Plantain", price: 8000 },
      { id: 6, name: "Coleslaw", price: 5000 },
    ],
    featured: true,
    rating: 4.9,
    reviewCount: 198,
  },
  {
    id: 3,
    name: "Cassava Leaves",
    category: "african",
    price: 75000,
    image: "/cassava-leaves-stew.jpg",
    description: "Traditional cassava leaves stew with fish and meat",
    longDescription:
      "A Sierra Leonean favorite! Our Cassava Leaves are slow-cooked with palm oil, fish, and meat until tender and flavorful. Served with rice or fufu.",
    addOns: [
      { id: 7, name: "Extra Fish", price: 15000 },
      { id: 8, name: "Extra Meat", price: 18000 },
      { id: 9, name: "Rice", price: 10000 },
    ],
    featured: true,
    rating: 4.7,
    reviewCount: 156,
  },
  {
    id: 4,
    name: "Meat Pie",
    category: "bakery",
    price: 15000,
    image: "/african-meat-pie-pastry.jpg",
    description: "Freshly baked meat pie with savory filling",
    longDescription:
      "Our signature Meat Pie features a flaky, golden crust filled with seasoned ground beef, potatoes, and vegetables. Baked fresh daily.",
    addOns: [
      { id: 10, name: "Extra Pie", price: 15000 },
      { id: 11, name: "Soft Drink", price: 5000 },
    ],
    featured: true,
    rating: 4.6,
    reviewCount: 289,
  },
  {
    id: 5,
    name: "Fish Roll",
    category: "bakery",
    price: 12000,
    image: "/fish-roll-pastry.jpg",
    description: "Crispy fish roll with seasoned fish filling",
    longDescription:
      "Delicious fish rolls made with fresh fish, onions, and spices, wrapped in a crispy pastry shell. Perfect for a quick snack or light meal.",
    addOns: [
      { id: 12, name: "Extra Roll", price: 12000 },
      { id: 13, name: "Hot Sauce", price: 2000 },
    ],
    rating: 4.5,
    reviewCount: 167,
  },
  {
    id: 6,
    name: "Fresh Bread",
    category: "bakery",
    price: 8000,
    image: "/fresh-baked-bread-loaf.jpg",
    description: "Freshly baked bread, soft and warm",
    longDescription:
      "Our bread is baked fresh every morning using quality ingredients. Soft, fluffy, and perfect for sandwiches or enjoying with butter.",
    addOns: [
      { id: 14, name: "Butter", price: 3000 },
      { id: 15, name: "Jam", price: 4000 },
    ],
    rating: 4.8,
    reviewCount: 312,
  },
  {
    id: 7,
    name: "Birthday Cake",
    category: "bakery",
    price: 250000,
    image: "/decorated-birthday-cake.jpg",
    description: "Custom birthday cake with your choice of flavor and design",
    longDescription:
      "Celebrate special moments with our custom birthday cakes. Available in various flavors including chocolate, vanilla, and red velvet. Custom designs available upon request.",
    addOns: [
      { id: 16, name: "Extra Layer", price: 50000 },
      { id: 17, name: "Custom Message", price: 10000 },
      { id: 18, name: "Candles", price: 5000 },
    ],
    featured: true,
    rating: 4.9,
    reviewCount: 145,
  },
  {
    id: 8,
    name: "Egusi Soup",
    category: "african",
    price: 80000,
    image: "/egusi-soup-african.jpg",
    description: "Rich egusi soup with melon seeds and vegetables",
    longDescription:
      "Traditional West African soup made with ground melon seeds, leafy vegetables, and your choice of meat or fish. A nutritious and delicious meal.",
    addOns: [
      { id: 19, name: "Extra Meat", price: 15000 },
      { id: 20, name: "Extra Fish", price: 12000 },
      { id: 21, name: "Pounded Yam", price: 15000 },
    ],
    rating: 4.7,
    reviewCount: 178,
  },
  {
    id: 9,
    name: "Ice Cream",
    category: "drinks",
    price: 20000,
    image: "/ice-cream-cone.png",
    description: "Creamy ice cream in various flavors",
    longDescription:
      "Cool down with our delicious ice cream available in multiple flavors including vanilla, chocolate, strawberry, and more.",
    addOns: [
      { id: 22, name: "Extra Scoop", price: 10000 },
      { id: 23, name: "Toppings", price: 5000 },
    ],
    rating: 4.6,
    reviewCount: 201,
  },
  {
    id: 10,
    name: "Fufu with Okra",
    category: "african",
    price: 70000,
    image: "/fufu-with-okra-soup.jpg",
    description: "Traditional fufu served with okra soup",
    longDescription:
      "Smooth, stretchy fufu paired with our delicious okra soup. A classic African combination that's both filling and flavorful.",
    addOns: [
      { id: 24, name: "Extra Fufu", price: 12000 },
      { id: 25, name: "Extra Soup", price: 15000 },
      { id: 26, name: "Fish", price: 12000 },
    ],
    rating: 4.5,
    reviewCount: 192,
  },
  {
    id: 11,
    name: "Acheke",
    category: "african",
    price: 55000,
    image: "/acheke-african-dish.jpg",
    description: "West African couscous with fish and vegetables",
    longDescription:
      "Acheke is a popular West African dish made from fermented cassava couscous, served with fried fish, onions, and tomatoes.",
    addOns: [
      { id: 27, name: "Extra Fish", price: 15000 },
      { id: 28, name: "Extra Vegetables", price: 8000 },
    ],
    rating: 4.6,
    reviewCount: 134,
  },
  {
    id: 12,
    name: "Bubble Milk",
    category: "drinks",
    price: 18000,
    image: "/bubble-milk-tea-drink.jpg",
    description: "Refreshing bubble milk tea with tapioca pearls",
    longDescription: "Creamy milk tea with chewy tapioca pearls. Available in various flavors for a refreshing treat.",
    addOns: [
      { id: 29, name: "Extra Pearls", price: 5000 },
      { id: 30, name: "Less Sugar", price: 0 },
    ],
    rating: 4.7,
    reviewCount: 167,
  },
]

export const categories = [
  { id: "all", name: "All Items" },
  { id: "african", name: "African Dishes" },
  { id: "bakery", name: "Bakery & Pastries" },
  { id: "drinks", name: "Drinks & Desserts" },
]
