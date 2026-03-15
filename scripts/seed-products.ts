import { createClient } from "@supabase/supabase-js"

// Products data from lib/products.ts
const products = [
  {
    name: "Spaghetti",
    category: "african",
    price: 180,
    image: "/spaghetti-chicken.jpg",
    description: "Delicious spaghetti with rich tomato sauce and herbs",
    long_description: "Our signature spaghetti is cooked to perfection with a rich tomato sauce, fresh herbs, and your choice of protein. A classic favorite that never disappoints.",
    featured: true,
    rating: 4.8,
    review_count: 124,
    is_active: true,
    addOns: [
      { name: "Extra Meat", price: 30 },
      { name: "Extra Cheese", price: 15 },
      { name: "Garlic Bread", price: 20 },
    ],
  },
  {
    name: "Whole Chicken",
    category: "african",
    price: 300,
    image: "/whole-chicken-new.jpg",
    description: "Perfectly roasted whole chicken with seasoning",
    long_description: "A full roasted chicken seasoned with our special blend of spices. Served with crispy fries. Perfect for sharing with family and friends.",
    featured: true,
    rating: 4.9,
    review_count: 198,
    is_active: true,
    addOns: [
      { name: "Extra Sauce", price: 10 },
      { name: "Fried Plantain", price: 15 },
      { name: "Coleslaw", price: 10 },
    ],
  },
  {
    name: "Half Chicken",
    category: "african",
    price: 250,
    image: "/images/half-20chinken.jpg",
    description: "Half roasted chicken with special seasoning",
    long_description: "Half of our perfectly roasted chicken, ideal for a single serving or smaller appetite. Seasoned to perfection.",
    featured: true,
    rating: 4.7,
    review_count: 156,
    is_active: true,
    addOns: [
      { name: "Extra Sauce", price: 10 },
      { name: "Fried Plantain", price: 15 },
      { name: "Rice", price: 20 },
    ],
  },
  {
    name: "Bulgur with Fish",
    category: "african",
    price: 250,
    image: "/images/bulgur.jpg",
    description: "Nutritious bulgur wheat served with fresh fish",
    long_description: "Healthy bulgur wheat cooked with vegetables and served with perfectly seasoned fish. A nutritious and delicious meal.",
    featured: true,
    rating: 4.6,
    review_count: 89,
    is_active: true,
    addOns: [
      { name: "Extra Fish", price: 40 },
      { name: "Extra Vegetables", price: 15 },
    ],
  },
  {
    name: "Fried Rice and Fish",
    category: "african",
    price: 250,
    image: "/images/fried-20rice-20and-20grilled-c2-a0fish.jpg",
    description: "Flavorful fried rice with seasoned grilled fish - Choose your size!",
    long_description: "Our special fried rice loaded with vegetables and served with perfectly grilled fish, fresh coleslaw, and fried plantains. A complete and satisfying meal. Available in Small (250 Le) and Large (350 Le) sizes!",
    featured: false,
    rating: 4.8,
    review_count: 167,
    is_active: true,
    variants: [
      { name: "Small Size", price: 250, description: "Regular portion" },
      { name: "Large Size", price: 350, description: "Extra large portion" },
    ],
    addOns: [
      { name: "Extra Fish", price: 40 },
      { name: "Plantain", price: 15 },
    ],
  },
  {
    name: "Fried Rice and Chicken",
    category: "african",
    price: 250,
    image: "/images/fride-20rice-20and-20chicken.jpg",
    description: "Tasty fried rice with tender chicken - Choose your size!",
    long_description: "Delicious fried rice with mixed vegetables and tender chicken pieces. A popular choice for lunch or dinner. Available in Small (250 Le) and Large (350 Le) sizes!",
    featured: false,
    rating: 4.7,
    review_count: 212,
    is_active: true,
    variants: [
      { name: "Small Size", price: 250, description: "Regular portion" },
      { name: "Large Size", price: 350, description: "Extra large portion" },
    ],
    addOns: [
      { name: "Extra Chicken", price: 30 },
      { name: "Coleslaw", price: 10 },
    ],
  },
  {
    name: "Shawarma Meat",
    category: "fast-food",
    price: 120,
    image: "/shawarma-meat.jpg",
    description: "Delicious meat shawarma wrap with fresh vegetables",
    long_description: "Tender marinated meat wrapped in fresh pita bread with lettuce, tomatoes, onions, and our special sauce.",
    featured: true,
    rating: 4.9,
    review_count: 245,
    is_active: true,
    addOns: [
      { name: "Extra Meat", price: 30 },
      { name: "Extra Sauce", price: 5 },
      { name: "Fries", price: 20 },
    ],
  },
  {
    name: "Shawarma Chicken",
    category: "fast-food",
    price: 100,
    image: "/shawarma-chicken.jpg",
    description: "Tasty chicken shawarma with fresh toppings",
    long_description: "Grilled chicken wrapped in soft pita with crisp vegetables and our signature garlic sauce. A customer favorite!",
    featured: false,
    rating: 4.8,
    review_count: 278,
    is_active: true,
    addOns: [
      { name: "Extra Chicken", price: 25 },
      { name: "Extra Sauce", price: 5 },
      { name: "Fries", price: 20 },
    ],
  },
  {
    name: "Burger",
    category: "fast-food",
    price: 100,
    image: "/burger-new.png",
    description: "Classic beef burger with fresh toppings",
    long_description: "Juicy beef patty with lettuce, tomato, onions, pickles, and our special burger sauce on a toasted bun.",
    featured: false,
    rating: 4.6,
    review_count: 201,
    is_active: true,
    addOns: [
      { name: "Extra Patty", price: 30 },
      { name: "Cheese", price: 10 },
      { name: "Bacon", price: 15 },
    ],
  },
  {
    name: "Egg Burger",
    category: "fast-food",
    price: 120,
    image: "/egg-burger-new.png",
    description: "Burger with fried egg and beef patty",
    long_description: "Our classic burger topped with a perfectly fried egg. The combination of runny yolk and juicy beef is irresistible!",
    featured: false,
    rating: 4.7,
    review_count: 192,
    is_active: true,
    addOns: [
      { name: "Extra Egg", price: 15 },
      { name: "Cheese", price: 10 },
      { name: "Fries", price: 20 },
    ],
  },
  {
    name: "Double Burger",
    category: "fast-food",
    price: 170,
    image: "/double-burger-new.png",
    description: "Double beef patty burger for big appetites",
    long_description: "Two juicy beef patties stacked high with cheese, lettuce, tomato, and our special sauce. For those with a hearty appetite!",
    featured: false,
    rating: 4.9,
    review_count: 234,
    is_active: true,
    addOns: [
      { name: "Extra Patty", price: 40 },
      { name: "Bacon", price: 15 },
      { name: "Fries", price: 20 },
    ],
  },
  {
    name: "Ice Cream Small",
    category: "drinks",
    price: 20,
    image: "/images/ice-20cream.jpg",
    description: "Small serving of creamy ice cream",
    long_description: "Cool and creamy ice cream in various flavors. Perfect for a sweet treat!",
    featured: false,
    rating: 4.5,
    review_count: 167,
    is_active: true,
    addOns: [
      { name: "Extra Scoop", price: 10 },
      { name: "Toppings", price: 5 },
    ],
  },
  {
    name: "Ice Cream Large",
    category: "drinks",
    price: 50,
    image: "/images/ice-20cream-201.jpg",
    description: "Large serving of delicious ice cream",
    long_description: "Generous portion of our creamy ice cream. Available in multiple flavors to satisfy your sweet tooth.",
    featured: false,
    rating: 4.6,
    review_count: 189,
    is_active: true,
    addOns: [
      { name: "Extra Scoop", price: 15 },
      { name: "Toppings", price: 8 },
    ],
  },
  {
    name: "Foofoo with Okra Soup",
    category: "african",
    price: 120,
    image: "/images/foofoo-20okara-20suap.jpg",
    description: "Traditional African foofoo with okra soup",
    long_description: "Smooth and stretchy foofoo served with rich okra soup and tender meat. A traditional African staple that's both filling and delicious.",
    featured: false,
    rating: 4.7,
    review_count: 145,
    is_active: true,
    addOns: [
      { name: "Extra Foofoo", price: 30 },
      { name: "Extra Soup", price: 25 },
      { name: "Fish", price: 30 },
    ],
  },
  {
    name: "Birthday Cake Small",
    category: "bakery",
    price: 350,
    image: "/images/birthday-20cake-20350.jpg",
    description: "Small birthday cake for intimate celebrations",
    long_description: "Beautiful birthday cake perfect for small gatherings. Available in various flavors and can be customized with a message. For customized designs message on WhatsApp +232 78 891638.",
    featured: true,
    rating: 4.8,
    review_count: 98,
    is_active: true,
    addOns: [
      { name: "Custom Message", price: 10 },
      { name: "Candles", price: 5 },
    ],
  },
  {
    name: "Birthday Cake Medium",
    category: "bakery",
    price: 550,
    image: "/images/birthday-20cake-20550.jpg",
    description: "Medium birthday cake for family celebrations",
    long_description: "Perfect sized cake for family birthday celebrations. Choose from chocolate, vanilla, or red velvet flavors. Can be customized with your child's favorite themes! For customized designs message on WhatsApp +232 78 891638.",
    featured: false,
    rating: 4.9,
    review_count: 112,
    is_active: true,
    addOns: [
      { name: "Custom Message", price: 10 },
      { name: "Candles", price: 5 },
    ],
  },
  {
    name: "Birthday Cake Large",
    category: "bakery",
    price: 2500,
    image: "/images/birthday-20cake-202500.jpg",
    description: "Large birthday cake for big parties",
    long_description: "Stunning large cake for big celebrations. Perfect for office parties, large family gatherings, or special events. Fully customizable design and flavors. For customized designs message on WhatsApp +232 78 891638.",
    featured: false,
    rating: 4.9,
    review_count: 87,
    is_active: true,
    is_customizable: true,
    addOns: [
      { name: "Custom Message", price: 10 },
      { name: "Candles", price: 5 },
      { name: "Extra Tier", price: 200 },
    ],
  },
  {
    name: "Meat Pie",
    category: "bakery",
    price: 15,
    image: "/meat-pie-new.png",
    description: "Savory meat pie with flaky crust",
    long_description: "Delicious meat filling wrapped in a golden, flaky pastry. Perfect for a snack or light meal.",
    featured: false,
    rating: 4.6,
    review_count: 234,
    is_active: true,
    addOns: [],
  },
  {
    name: "Spring Roll",
    category: "bakery",
    price: 20,
    image: "/spring-roll-new.png",
    description: "Crispy spring roll with vegetable filling",
    long_description: "Crispy and delicious spring rolls filled with seasoned vegetables. A popular snack choice!",
    featured: false,
    rating: 4.5,
    review_count: 178,
    is_active: true,
    addOns: [
      { name: "Extra Sauce", price: 5 },
    ],
  },
  {
    name: "Chin Chin",
    category: "bakery",
    price: 10,
    image: "/images/chin-20chin.jpg",
    description: "Crunchy West African snack",
    long_description: "Traditional West African fried dough snack. Crunchy, sweet, and addictive!",
    featured: false,
    rating: 4.7,
    review_count: 256,
    is_active: true,
    addOns: [],
  },
  {
    name: "Kebba",
    category: "african",
    price: 25,
    image: "/images/kebba.jpg",
    description: "Traditional African kebba dish",
    long_description: "Delicious traditional African kebba, a savory dish made with ground meat and spices.",
    featured: false,
    rating: 4.6,
    review_count: 89,
    is_active: true,
    addOns: [
      { name: "Extra Sauce", price: 5 },
    ],
  },
  {
    name: "Bread",
    category: "bakery",
    price: 10,
    image: "/images/bread.jpg",
    description: "Fresh baked bread loaf",
    long_description: "Freshly baked bread, soft on the inside with a golden crust. Perfect for sandwiches or with soup.",
    featured: false,
    rating: 4.8,
    review_count: 312,
    is_active: true,
    addOns: [],
  },
  {
    name: "Brown Bread",
    category: "bakery",
    price: 15,
    image: "/images/brown-20bread.jpg",
    description: "Healthy whole wheat brown bread",
    long_description: "Nutritious whole wheat brown bread. Healthier option with great taste and texture.",
    featured: false,
    rating: 4.7,
    review_count: 198,
    is_active: true,
    addOns: [],
  },
  {
    name: "Banana Bread",
    category: "bakery",
    price: 20,
    image: "/images/banana-20bread.jpg",
    description: "Moist banana bread with nuts",
    long_description: "Moist and delicious banana bread made with ripe bananas. A sweet treat for any time of day.",
    featured: false,
    rating: 4.8,
    review_count: 167,
    is_active: true,
    addOns: [],
  },
  {
    name: "Chicken Ball",
    category: "bakery",
    price: 15,
    image: "/images/chinken-20ball.jpg",
    description: "Crispy chicken balls",
    long_description: "Crispy fried chicken balls with seasoned chicken filling. Perfect snack or appetizer.",
    featured: false,
    rating: 4.6,
    review_count: 145,
    is_active: true,
    addOns: [
      { name: "Dipping Sauce", price: 5 },
    ],
  },
  {
    name: "Fish Ball",
    category: "bakery",
    price: 15,
    image: "/images/fish-20ball.jpg",
    description: "Crispy fish balls",
    long_description: "Crispy fried fish balls with seasoned fish filling. Delicious on their own or with sauce.",
    featured: false,
    rating: 4.5,
    review_count: 123,
    is_active: true,
    addOns: [
      { name: "Dipping Sauce", price: 5 },
    ],
  },
  {
    name: "Grilled Fish",
    category: "african",
    price: 180,
    image: "/images/grilled-20fish.jpg",
    description: "Perfectly grilled whole fish",
    long_description: "Whole fish grilled to perfection with our special blend of spices. Served with sides of your choice.",
    featured: false,
    rating: 4.8,
    review_count: 178,
    is_active: true,
    addOns: [
      { name: "Plantain", price: 15 },
      { name: "Extra Sauce", price: 10 },
      { name: "Rice", price: 30 },
    ],
  },
  {
    name: "Gizzard on Stick",
    category: "african",
    price: 30,
    image: "/images/gizzard-20on-20stick.jpg",
    description: "Grilled chicken gizzard skewers",
    long_description: "Tender chicken gizzards grilled on skewers with special seasoning. A popular street food delicacy!",
    featured: false,
    rating: 4.7,
    review_count: 134,
    is_active: true,
    addOns: [
      { name: "Extra Sauce", price: 5 },
    ],
  },
  {
    name: "Krain Krain",
    category: "african",
    price: 150,
    image: "/images/krain-20krain.jpg",
    description: "Traditional West African krain krain soup",
    long_description: "Hearty West African soup made with leafy greens and meat. Served with rice or foofoo.",
    featured: false,
    rating: 4.6,
    review_count: 98,
    is_active: true,
    addOns: [
      { name: "Extra Meat", price: 30 },
      { name: "Rice", price: 30 },
      { name: "Foofoo", price: 40 },
    ],
  },
  {
    name: "Beans",
    category: "african",
    price: 80,
    image: "/images/bean-27s.jpg",
    description: "Nigerian-style stewed beans",
    long_description: "Delicious stewed beans cooked Nigerian style with palm oil and spices. Served with plantain or bread.",
    featured: false,
    rating: 4.5,
    review_count: 167,
    is_active: true,
    addOns: [
      { name: "Plantain", price: 15 },
      { name: "Bread", price: 10 },
      { name: "Fish", price: 40 },
    ],
  },
  {
    name: "Laffadie",
    category: "african",
    price: 150,
    image: "/images/laffadie-20150.jpg",
    description: "Traditional Sierra Leonean laffadie",
    long_description: "Traditional Sierra Leonean dish made with rice flour. A local favorite with unique taste and texture.",
    featured: false,
    rating: 4.6,
    review_count: 78,
    is_active: true,
    addOns: [
      { name: "Extra Sauce", price: 15 },
      { name: "Fish", price: 40 },
    ],
  },
  {
    name: "Fanta",
    category: "drinks",
    price: 15,
    image: "/images/ice-20cold-20fanta.jpeg",
    description: "Ice cold Fanta orange soda",
    long_description: "Refreshing ice-cold Fanta orange soda. Perfect to pair with any meal.",
    featured: false,
    rating: 4.4,
    review_count: 234,
    is_active: true,
    addOns: [],
  },
  {
    name: "Maltina",
    category: "drinks",
    price: 20,
    image: "/images/maltina.jpeg",
    description: "Refreshing Maltina malt drink",
    long_description: "Refreshing non-alcoholic malt beverage. Rich, sweet, and nutritious.",
    featured: false,
    rating: 4.5,
    review_count: 189,
    is_active: true,
    addOns: [],
  },
  {
    name: "Lucozade",
    category: "drinks",
    price: 25,
    image: "/images/lucozade-20drink.jpg",
    description: "Lucozade energy drink",
    long_description: "Energizing Lucozade drink. Great for a quick energy boost.",
    featured: false,
    rating: 4.4,
    review_count: 156,
    is_active: true,
    addOns: [],
  },
  {
    name: "Customize Cake",
    category: "bakery",
    price: 500,
    image: "/images/customize-20cake.jpg",
    description: "Custom designed cake for any occasion",
    long_description: "Fully customizable cake for weddings, birthdays, and special events. Contact us on WhatsApp +232 78 891638 to discuss your design!",
    featured: true,
    rating: 4.9,
    review_count: 67,
    is_active: true,
    is_customizable: true,
    addOns: [
      { name: "Extra Tier", price: 200 },
      { name: "Custom Figurines", price: 100 },
      { name: "Photo Topper", price: 50 },
    ],
  },
  {
    name: "Acheke and Chicken",
    category: "african",
    price: 200,
    image: "/acheke-african-dish.jpg",
    description: "Traditional Acheke with grilled chicken",
    long_description: "Authentic West African Acheke (attieke) - fermented cassava couscous served with tender grilled chicken. A delicious and filling traditional meal!",
    featured: true,
    rating: 4.8,
    review_count: 156,
    is_active: true,
    addOns: [
      { name: "Extra Chicken", price: 50 },
      { name: "Extra Acheke", price: 30 },
      { name: "Extra Sauce", price: 10 },
    ],
  },
  {
    name: "Acheke and Fish",
    category: "african",
    price: 300,
    image: "/acheke-african-dish.jpg",
    description: "Traditional Acheke with grilled fish",
    long_description: "Authentic West African Acheke (attieke) - fermented cassava couscous served with perfectly grilled fish. A delicious and filling traditional meal!",
    featured: false,
    rating: 4.9,
    review_count: 178,
    is_active: true,
    addOns: [
      { name: "Extra Fish", price: 60 },
      { name: "Extra Acheke", price: 30 },
      { name: "Extra Sauce", price: 10 },
    ],
  },
  {
    name: "Acheke and Goat",
    category: "african",
    price: 400,
    image: "/acheke-african-dish.jpg",
    description: "Traditional Acheke with grilled goat meat",
    long_description: "Authentic West African Acheke (attieke) - fermented cassava couscous served with succulent grilled goat meat. A premium traditional delicacy!",
    featured: false,
    rating: 4.9,
    review_count: 134,
    is_active: true,
    addOns: [
      { name: "Extra Goat Meat", price: 80 },
      { name: "Extra Acheke", price: 30 },
      { name: "Extra Sauce", price: 10 },
    ],
  },
  {
    name: "Cup Cake",
    category: "bakery",
    price: 15,
    image: "/cupcake.png",
    description: "Sweet and fluffy cupcake",
    long_description: "Deliciously moist cupcake topped with creamy frosting and sprinkles. The perfect sweet treat!",
    featured: false,
    rating: 4.6,
    review_count: 145,
    is_active: true,
    addOns: [],
  },
]

async function seedProducts() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials")
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log("Starting product seeding...")

  // Clear existing data
  console.log("Clearing existing product data...")
  await supabase.from("product_addons").delete().neq("id", 0)
  await supabase.from("product_variants").delete().neq("id", 0)
  await supabase.from("products").delete().neq("id", 0)

  for (const product of products) {
    console.log(`Inserting product: ${product.name}`)

    // Insert the product
    const { data: insertedProduct, error: productError } = await supabase
      .from("products")
      .insert({
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        description: product.description,
        long_description: product.long_description,
        featured: product.featured ?? false,
        rating: product.rating ?? null,
        review_count: product.review_count ?? 0,
        is_customizable: product.is_customizable ?? false,
        is_active: product.is_active ?? true,
      })
      .select()
      .single()

    if (productError) {
      console.error(`Error inserting product ${product.name}:`, productError)
      continue
    }

    const productId = insertedProduct.id

    // Insert variants if any
    if (product.variants && product.variants.length > 0) {
      for (const variant of product.variants) {
        const { error: variantError } = await supabase.from("product_variants").insert({
          product_id: productId,
          name: variant.name,
          price: variant.price,
          description: variant.description ?? null,
        })

        if (variantError) {
          console.error(`Error inserting variant for ${product.name}:`, variantError)
        }
      }
    }

    // Insert add-ons if any
    if (product.addOns && product.addOns.length > 0) {
      for (const addOn of product.addOns) {
        const { error: addOnError } = await supabase.from("product_addons").insert({
          product_id: productId,
          name: addOn.name,
          price: addOn.price,
        })

        if (addOnError) {
          console.error(`Error inserting add-on for ${product.name}:`, addOnError)
        }
      }
    }
  }

  console.log("Product seeding complete!")
}

seedProducts().catch(console.error)
