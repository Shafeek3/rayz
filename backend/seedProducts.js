const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product.js');

dotenv.config(); // Load your .env file

const products = [
  // Rings
    {
    name: "Elegant Gold Ring",
    price: 129.99,
    image: "https://th.bing.com/th/id/OIP.nUX1-NKk2v5hSxU_Kc_5JQHaHy?w=179&h=189&c=7&r=0&o=7&pid=1.7&rm=3",
    category: "rings",
    isBestSeller: true,
    isNewArrival: false
  },
  {
    name: "Rose Gold Engagement Ring",
    price: 145.50,
    image: "https://salty.co.in/cdn/shop/files/RS13614-S_2fac551c-244e-4c16-b7e6-b1deba9a2b48.jpg?v=1754124263&width=1080",
    category: "rings",
    isBestSeller: false,
    isNewArrival: true
  },
  {
    name: "Silver Diamond Ring",
    price: 99.99,
    image: "https://kinclimg3.bluestone.com/f_jpg,c_scale,w_828,q_80,b_rgb:f0f0f0/giproduct/BIDG0319R180_YAA18DIG6XXXXXXXX_ABCD00-PICS-00001-1024-66194.png",
    category: "rings",
    isBestSeller: true,
    isNewArrival: true
  },
  {
    name: "Classic Platinum Ring",
    price: 210.00,
    image: "https://www.kirtilals.com/images/media/products/15066/500x500/fancy-ring-of-yellow-and-rose-gold-with-a-diamond-studded-flower-and-leaf-motif-15066-2.png",
    category: "rings",
    isBestSeller: false,
    isNewArrival: false
  },
  {
    name: "Minimalist Silver Ring",
    price: 59.99,
    image: "https://kinclimg1.bluestone.com/f_jpg,c_scale,w_1024,q_80,b_rgb:f0f0f0/giproduct/BISL0872R14_YAA18DIG6XXXXXXXX_ABCD00-BP-PICS-00001-1024-74266.png",
    category: "rings",
    isBestSeller: true,
    isNewArrival: false
  },
  {
    name: "Emerald Stone Ring",
    price: 179.49,
    image: "https://kinclimg2.bluestone.com/f_jpg,c_scale,w_1024,q_80,b_rgb:f0f0f0/giproduct/BIAV0881R16_YAA18DIG4XXXXXXXX_ABCD00-BP-PICS-00001-1024-68969.png",
    category: "rings",
    isBestSeller: false,
    isNewArrival: true
  },
  {
    name: "Ruby Heart Ring",
    price: 155.75,
    image: "https://images.jdmagicbox.com/quickquotes/images_main/fancy-gold-ring-2182486907-6vzqzl2c.jpg",
    category: "rings",
    isBestSeller: true,
    isNewArrival: true
  },
  {
    name: "Vintage Gold Band",
    price: 134.20,
    image: "https://amroop.com/cdn/shop/files/amroopjewelleryrings_96b29c48-250a-4349-aaaa-c6681372180b.jpg?v=1724339959",
    category: "rings",
    isBestSeller: false,
    isNewArrival: false
  },
  {
    name: "Sapphire Luxury Ring",
    price: 189.00,
    image: "https://www.kirtilals.com/images/media/products/15066/500x500/fancy-ring-of-yellow-and-rose-gold-with-a-diamond-studded-flower-and-leaf-motif-15066-2.png",
    category: "rings",
    isBestSeller: true,
    isNewArrival: false
  },
  {
    name: "Twisted Rope Ring",
    price: 69.50,
    image: "https://images-eu.ssl-images-amazon.com/images/I/413sMcRGS2L.jpg",
    category: "rings",
    isBestSeller: false,
    isNewArrival: true
  },
  
 {
  name: "Classic Diamond Bracelet",
  image: "https://ik.imagekit.io/fig/tr:w-600,h-700,pr-true,cm-pad_resize,bg-FFFFFF/image/image_site98/catalog/product/YBBN_91340_1.jpg",
  price: 1899.99,
  description: "Elegant diamond bracelet with a timeless design perfect for any occasion.",
  category: "bracelets"
},
{
  name: "Minimalist Gold Bracelet",
  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnvQoRmHdxk8EOsZcO6WHR2DA-u9NmN6dBsA&s",
  price: 999.99,
  description: "Sleek gold bracelet with a minimalistic touch for everyday wear.",
  category: "bracelets"
},
{
  name: "Rose Gold Charm Bracelet",
  image: "https://i.pinimg.com/736x/7e/34/7b/7e347b6b4d2992071da077d64d4361ab.jpg",
  price: 1249.99,
  description: "Chic rose gold bracelet with delicate charm accents.",
  category: "bracelets"
},
{
  name: "Multi-Cut Moissanite Bracelet",
  image: "https://5.imimg.com/data5/ZU/ZV/SG/SELLER-18197321/14-multi-fancy-cut-moissanite-bracelet.jpg",
  price: 2150.00,
  description: "Premium moissanite bracelet with multiple fancy-cut stones.",
  category: "bracelets"
},
{
  name: "White Gold Diamond Bracelet",
  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAOxGMsof7CKPrZ1ihDQ96EduXTP-Vtak72GM2q4g1WX_e5Ybm2QEvXEPYmTIyrQRpmcU&usqp=CAU",
  price: 2899.99,
  description: "Sophisticated white gold bracelet encrusted with brilliant diamonds.",
  category: "bracelets"
},
{
  name: "Luxury Platinum Bracelet",
  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdkf0qgD5V4l-u125GzHzqqkLHYGjiGVuq62UiFvCfMPVTWpl_HRMj5xyNlI4bUY0vmDo&usqp=CAU",
  price: 3799.00,
  description: "High-end platinum bracelet with fine detailing and premium finish.",
  category: "bracelets"
},
{
  name: "Classic Silver Bracelet",
  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScAvb-amBQi-GO-6C9UlsMLSGdHttJf4UO5A&s",
  price: 749.99,
  description: "Refined silver bracelet with a polished minimalist style.",
  category: "bracelets"
},
{
  name: "White Crystal Designer Bracelet",
  image: "https://assets.ajio.com/medias/sys_master/root/20240514/a53b/6642e74116fd2c6e6a033721/-473Wx593H-467328219-white-MODEL.jpg",
  price: 1350.00,
  description: "Fashion-forward designer bracelet with sparkling white crystals.",
  category: "bracelets"
},

  // Bracelets

  
  {
    name: "Elegant Gold Bangle",
    price: 180,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwvD0Y4Y7xNxqPwojmkUy3PrTOcVEWpF8YBA&s",
    category: "bangles",
    isBestSeller: true,
    isNewArrival: false,
    description: "An elegant gold bangle perfect for traditional occasions."
  },
  {
    name: "Designer Bridal Bangle",
    price: 250,
    image: "https://www.tarinika.in/cdn/shop/files/ABX2807X_2.jpg?v=1714992487",
    category: "bangles",
    isBestSeller: true,
    isNewArrival: true,
    description: "Designer bridal bangle with intricate craftsmanship."
  },
  {
    name: "Classic Gold Bangle",
    price: 160,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST012UYKWwYDQd1UmJn19I9IPo8GzjS7u1Ss9tigVx1hDIO-0DPcVwB3bUDmJ3GQEgHB8&usqp=CAU",
    category: "bangles",
    isBestSeller: false,
    isNewArrival: true,
    description: "Classic gold bangle with a timeless design."
  },
  {
    name: "Royal Gold Bangle",
    price: 300,
    image: "https://manoharlaljewellers.in/cdn/shop/files/IMG_9475.png?v=1732968868",
    category: "bangles",
    isBestSeller: true,
    isNewArrival: false,
    description: "Royal gold bangle for weddings and grand occasions."
  },
  {
    name: "CZ Stone Bangle",
    price: 120,
    image: "https://listany-prod.s3.amazonaws.com/images/MKJewel/czbr01273_2m",
    category: "bangles",
    isBestSeller: false,
    isNewArrival: true,
    description: "Bangle with embedded CZ stones for a modern touch."
  },
  {
    name: "Minimalist Gold Bangle",
    price: 95,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShVmbogOOa9iZk0c-ySxU5prxkNcralnnaiA&s",
    category: "bangles",
    isBestSeller: false,
    isNewArrival: false,
    description: "Simple and elegant gold bangle for daily wear."
  },
    {
    name: "Magic Petals Diamond Necklace",
    price: 1200,
    image: "https://www.kirtilals.com/images/media/products/19723/500x500/magic-petals-diamond-necklace-19723-1.png",
    category: "necklaces",
    isBestSeller: true,
    isNewArrival: false,
    description: "Elegant diamond necklace with magic petal design."
  },
  {
    name: "Pretty and Perfect Diamond Necklace",
    price: 1400,
    image: "https://www.kirtilals.com/images/media/products/20266/500x500/pretty-and-perfect-diamond-necklace-20266-1.png",
    category: "necklaces",
    isBestSeller: false,
    isNewArrival: true,
    description: "Sophisticated diamond necklace with a timeless style."
  },
  {
    name: "Brilliant Earth Diamond Necklace",
    price: 2000,
    image: "https://www.brilliantearth.com/_next/image/?url=https%3A%2F%2Fcdn.builder.io%2Fapi%2Fv1%2Fimage%2Fassets%252F9f2a69003c86470ea05deb9ecb9887be%252F87af67c7c82b4552bd5d3bc43f1a70b3&w=3840&q=95&dpl=b566d735975b0fb912a6c7a8deebb1babafcc645",
    category: "necklaces",
    isBestSeller: true,
    isNewArrival: false,
    description: "Luxurious diamond necklace with a brilliant finish."
  },
  {
    name: "Contemporary Stone Necklace",
    price: 750,
    image: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/JULY/9/T9ThCsfC_d85cea0af31840c2b86828b04c14af5b.jpg",
    category: "necklaces",
    isBestSeller: false,
    isNewArrival: true,
    description: "Modern necklace with intricate stonework."
  },
  {
    name: "Royal Heritage Necklace",
    price: 1800,
    image: "https://thejaipurgems.in/cdn/shop/files/126_b3452ecb-5c70-460d-8bee-32c84286d088.jpg",
    category: "necklaces",
    isBestSeller: true,
    isNewArrival: false,
    description: "Traditional royal-inspired necklace with intricate details."
  },
  {
    name: "Handmade Bohemian Necklace",
    price: 300,
    image: "https://i.etsystatic.com/20648724/r/il/adbb05/4720456062/il_570xN.4720456062_2pwt.jpg",
    category: "necklaces",
    isBestSeller: false,
    isNewArrival: true,
    description: "Artisan-crafted bohemian style necklace."
  },
  {
    name: "Emerald Diamond Necklace",
    price: 2500,
    image: "https://5.imimg.com/data5/SELLER/Default/2023/4/299634319/GM/AK/UL/154114890/exquisite-emerald-diamond-necklace-500x500.jpg",
    category: "necklaces",
    isBestSeller: true,
    isNewArrival: false,
    description: "Exquisite emerald and diamond blend for luxury lovers."
  },
  {
    name: "Senco Designer Necklace",
    price: 1600,
    image: "https://sencowebfiles.s3.ap-south-1.amazonaws.com/products/KGJIkn8qD1Y4OsZ7sgg1LXqdTcfen2DBESTJeu5J.jpeg",
    category: "necklaces",
    isBestSeller: false,
    isNewArrival: true,
    description: "Delicately designed necklace with fine craftsmanship."
  },
  {
    name: "Bhindi Gold Necklace",
    price: 2200,
    image: "https://www.bhindi.com/upload/category/bhindi-gold-necklace-sets-1728069517.jpg",
    category: "necklaces",
    isBestSeller: true,
    isNewArrival: false,
    description: "Premium gold necklace set for weddings and events."
  },
  {
    name: "Multicolor Stone Necklace",
    price: 500,
    image: "https://assets.ajio.com/medias/sys_master/root/20230727/hRhd/64c259e7eebac147fc8dcf34/-473Wx593H-465303669-multi-MODEL.jpg",
    category: "necklaces",
    isBestSeller: false,
    isNewArrival: true,
    description: "Charming multicolor stone necklace for casual occasions."
  },
  // Anklets
  {
    name: "Elegant Gold Anklet",
    price: 45.99,
    image: "https://images.meesho.com/images/products/30104932/xvg61_512.webp?width=512",
    category: "anklets",
    isBestSeller: false,
    isNewArrival: true,
    description: "Elegant gold anklet for a graceful look."
  },
  {
    name: "Silver Bead Anklet",
    price: 30,
    image: "https://www.tarinika.in/cdn/shop/products/IMG_9618.jpg?v=1632397705&width=1500",
    category: "anklets",
    isBestSeller: true,
    isNewArrival: false,
    description: "Silver anklet with bead detailing."
  },
  // Earrings
  {
    name: "Pearl Drop Earrings",
    price: 50,
    image: "https://www.tarinika.in/cdn/shop/files/UntitledSession4528.jpg?v=1692287666&width=1780",
    category: "earrings",
    isBestSeller: false,
    isNewArrival: true,
    description: "Elegant pearl drop earrings."
  },
  {
    name: "Zirconia Stud Earrings",
    price: 30,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_YneK8K-v-jgCkw1nAz7NDOi4AC6Rth3nJg&s",
    category: "earrings",
    isBestSeller: true,
    isNewArrival: false,
    description: "Sparkling zirconia stud earrings."
  },
  // Necklaces
  {
    name: "Diamond Necklace",
    price: 250,
    image: "https://mesmerizeindia.com/cdn/shop/files/RoseGoldMagneticHeartNecklace.jpg?v=1736171561&width=2048",
    category: "necklaces",
    isBestSeller: true,
    isNewArrival: true,
    description: "Stunning diamond necklace for luxury."
  },
  {
    name: "Gold Chain Necklace",
    price: 110,
    image: "https://m.media-amazon.com/images/I/61xUQIASFkL._UY1100_.jpg",
    category: "necklaces",
    isBestSeller: false,
    isNewArrival: false,
    description: "Simple gold chain necklace."
  },
  {
    name: "Elegant Silver Anklet",
    price: 49.99,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl-n9BP7EXHdL8p2yjnh1okxdeFbvyubqaZg&s",
    category: "anklets",
    isBestSeller: true,
    isNewArrival: false
  },
  {
    name: "Golden Beaded Anklet",
    price: 59.50,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj9i4itB7nqSSZ8N8iYAj5wEY5QF40EKQGRg&s",
    category: "anklets",
    isBestSeller: false,
    isNewArrival: true
  },
  {
    name: "Traditional Pearl Anklet",
    price: 79.99,
    image: "https://www.tarinika.in/cdn/shop/products/IMG_9618.jpg?v=1632397705&width=1500",
    category: "anklets",
    isBestSeller: true,
    isNewArrival: true
  },
  {
    name: "Minimalist Gold Chain Anklet",
    price: 39.00,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdFRBIZBRpUIOErwm_uh2hxkyzMI8EBdiGnA&s",
    category: "anklets",
    isBestSeller: false,
    isNewArrival: false
  },
  {
    name: "Dual Layered Anklet",
    price: 45.75,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMAB9vyk3m2A6CLapaM4zj8TM4LVeQwYGREg&s",
    category: "anklets",
    isBestSeller: true,
    isNewArrival: true
  }

];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Product.deleteMany(); // optional: clears old products
    await Product.insertMany(products);
    console.log("Sample products inserted!");
    process.exit();
  } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
  
  seedData();