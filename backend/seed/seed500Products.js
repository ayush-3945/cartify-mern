require('dotenv').config()
const mongoose = require('mongoose')
const dns = require('dns')
dns.setServers(['8.8.8.8', '1.1.1.1'])

const Product = require('../models/Product')
const Category = require('../models/Category')
const Brand = require('../models/Brand')

const categoryData = [
  { name: "Smartphones & Tablets" },
  { name: "Laptops & Computers" },
  { name: "Headphones & Audio" },
  { name: "Smart Watches & Wearables" },
  { name: "Gaming & Consoles" },
  { name: "Cameras & Photography" },
  { name: "Men's Fashion" },
  { name: "Women's Fashion" },
  { name: "Footwear & Sneakers" },
  { name: "Luxury Watches" },
  { name: "Bags & Backpacks" },
  { name: "Sunglasses & Eyewear" },
  { name: "Jewelry & Accessories" },
  { name: "Beauty & Skincare" },
  { name: "Fragrances & Perfumes" },
  { name: "Home Decor & Living" },
  { name: "Kitchen & Dining" },
  { name: "Furniture" },
  { name: "Sports & Fitness" },
  { name: "Automotive & Gadgets" }
]

const brandNames = [
  "Apple", "Samsung", "Sony", "Nike", "Adidas", "Puma", "Dell", "HP", "Asus", "Lenovo",
  "Zara", "H&M", "Levi's", "Rolex", "Fossil", "Casio", "Ray-Ban", "Bose", "JBL", "Canon",
  "Nikon", "PlayStation", "Nintendo", "L'Oreal", "Chanel", "Dior", "Gucci", "Philips",
  "Xiaomi", "OnePlus", "Logitech", "Razer", "Sennheiser", "Under Armour", "Tommy Hilfiger"
]

// Curated high quality Unsplash e-commerce image pools per category
const imagePools = {
  "Smartphones & Tablets": [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80"
  ],
  "Laptops & Computers": [
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80"
  ],
  "Headphones & Audio": [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80"
  ],
  "Smart Watches & Wearables": [
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80"
  ],
  "Gaming & Consoles": [
    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1612287232230-0ec826359f5d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1592840496073-e72bb61926fb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80"
  ],
  "Cameras & Photography": [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=800&q=80"
  ],
  "Men's Fashion": [
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80"
  ],
  "Women's Fashion": [
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80"
  ],
  "Footwear & Sneakers": [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80"
  ],
  "Luxury Watches": [
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1547996160-71dfabbce5fa?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80"
  ],
  "Bags & Backpacks": [
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
  ],
  "Sunglasses & Eyewear": [
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80"
  ],
  "Jewelry & Accessories": [
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80"
  ],
  "Beauty & Skincare": [
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"
  ],
  "Fragrances & Perfumes": [
    "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80"
  ],
  "Home Decor & Living": [
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80"
  ],
  "Kitchen & Dining": [
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1584990347449-399eb2a79e43?auto=format&fit=crop&w=800&q=80"
  ],
  "Furniture": [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80"
  ],
  "Sports & Fitness": [
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80"
  ],
  "Automotive & Gadgets": [
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80"
  ]
}

const productTitles = {
  "Smartphones & Tablets": [
    "Pro Max 5G Ultra Smartphone", "Galaxy Edge OLED Smartphone", "Pixel AI Vision Smartphone",
    "Flagship Dual-SIM 256GB Phone", "Infinity Display Tablet 11-inch", "Super Retina Slim Pad 128GB",
    "Foldable Flex OLED Smart Device", "Titanium Frame Flagship Mobile", "Ultra-Fast Gaming Phone 144Hz",
    "Compact Mini 5G Smartphone", "Creator Studio Tablet with Stylus", "All-Day Battery Power Smartphone",
    "CinemaWide Quad Camera Phone", "Crystal Clear Display Smartpad", "Next-Gen AI Octa-Core Device",
    "Waterproof Rugged Explorer Phone", "Premium Velvet Touch Smartphone", "Bionic Chip Performance Phone",
    "Dual Stereo Gaming Tablet 10-inch", "Sleek Ultra-Light 5G Mobile", "Night Vision Pro Smartphone",
    "Wireless Charging Flagship Phone", "Carbon Edition 512GB Phone", "HDR10+ AMOLED Smart Device",
    "Edge-to-Edge Bezel-less Mobile", "Studio Grade Sound Smartphone"
  ],
  "Laptops & Computers": [
    "UltraBook Pro 15.6 Retina Laptop", "Air Slim M3 Lightweight Laptop", "Gaming Beast RTX 4080 Laptop",
    "Developer Edition Workstation 32GB", "Creator Studio 4K OLED Laptop", "Convertible 2-in-1 Touch Laptop",
    "Business Executive Travel Notebook", "Infinity Display Carbon Laptop", "Mechanical RGB Gaming Laptop",
    "Compact 13-inch Student Laptop", "Silent Fanless Daily Book", "Dual-Screen Creative Laptop",
    "Aerospace Aluminum Notebook", "High Refresh Rate Esports Laptop", "Thunderbolt 4 Fast Laptop",
    "All-Day Endurance Battery Notebook", "NanoEdge Ultra-Slim PC Laptop", "Precision Touchpad Pro Laptop",
    "Military Standard Rugged Notebook", "Quad-Core Performance Ultrabook", "Magnesium Alloy Lightweight PC",
    "Studio Master Sound Laptop", "Zero-Bezel 16-inch Power Laptop", "Anti-Glare IPS Office Laptop",
    "Rapid Charging Executive Notebook", "Stealth Black Edition Laptop"
  ],
  "Headphones & Audio": [
    "Wireless Active Noise Cancelling Headphones", "True Wireless Studio Earbuds with ANC", "Audiophile Over-Ear Hi-Res Headphones",
    "BassBoost Portable Bluetooth Speaker", "Waterproof Sport Earbuds with Hooks", "Spatial Audio 3D Surround Headphones",
    "Ultra-Lightweight Daily Earphones", "Studio Monitor Master Headset", "Retro Wooden Bluetooth Speaker",
    "RGB Gaming Headset with Mic", "Type-C High-Resolution IEMs", "Neckband Magnetic Wireless Earphones",
    "Compact Pocket Sound Speaker", "Multi-Point Bluetooth Travel Headphones", "Crystal Voice Conference Headset",
    "Bone Conduction Running Headphones", "Heavy Bass Dual Driver Earbuds", "Foldable Travel On-Ear Headphones",
    "Deep Bass 50W Outdoor Speaker", "Transparent Design Wireless Earbuds", "Lossless Audio Hi-Fi Headset",
    "Fast Charging 40-Hour Battery Cans", "Smart Touch Control Earbuds", "Titanium Dynamic Driver Headset",
    "Immersive Surround Sound Bar", "Dual Mic Noise Reduction Earphones"
  ],
  "Smart Watches & Wearables": [
    "Titanium GPS Smart Watch Ultra", "Heart Rate & SpO2 Fitness Tracker", "Amoled Display Sport Smartwatch",
    "Classic Stainless Steel Smart Watch", "Sleep & Stress Wellness Smart Band", "Rugged Outdoor Adventure Smartwatch",
    "E-SIM Cellular Calling Smart Watch", "Ultra-Thin Minimalist Smart Watch", "Waterproof Swimming Tracker Band",
    "Bluetooth Voice Assistant Smartwatch", "Sapphire Glass Luxury Smart Watch", "Golf & Running GPS Sports Watch",
    "Blood Pressure Monitor Smartwatch", "Interchangeable Strap Fitness Watch", "Solar Powered Outdoor Smartwatch",
    "AOD Retina Display Daily Watch", "Music Storage Bluetooth Smartwatch", "Bio-Sensor Active Health Watch",
    "Ceramic Bezel Premium Smart Watch", "Long Life 14-Day Battery Watch", "Dynamic Dial Touchscreen Watch",
    "Youth Vibrant Color Sports Band", "Shockproof Trail Smart Watch", "Precision Altitude Barometer Watch",
    "Wireless Magnetic Charging Watch", "All-In-One Modern Lifestyle Watch"
  ],
  "Gaming & Consoles": [
    "Next-Gen 4K HDR Gaming Console", "Handheld Portable Gaming Station", "Wireless Precision Ergonomic Controller",
    "Mechanical Hot-Swap RGB Gaming Keyboard", "Ultralight Honeycomb Gaming Mouse 16000DPI", "Virtual Reality Immersive VR Headset",
    "Dual Charging Dock Station", "Pro Esports Arcade Fight Stick", "Surround Sound Haptic Gaming Chair",
    "Speed Precision Extended Mouse Pad", "Cooling RGB Console Stand", "Ultra-Fast 1TB Expansion SSD Card",
    "Racing Wheel with Force Feedback Pedals", "Customizable Back Paddle Pro Gamepad", "Retro Classic Mini Arcade Console",
    "Noise Isolating Streamer Microphone", "4K 60FPS Game Capture Card", "Low Latency Wireless Gaming Adapter",
    "Controller Grips Silicone Protective Pack", "Aura Glow Ambient Light Strips", "High-Speed Braided Gaming Cable",
    "Dual Analog Stick Thumb Grips", "Anti-Ghosting Tenkeyless Keyboard", "Programmable Macro Flight Joystick",
    "Elite Wireless Gaming Gamepad", "Tempered Glass Headset Stand"
  ],
  "Cameras & Photography": [
    "Full-Frame Mirrorless 4K Cinema Camera", "Ultra Compact Point & Shoot Digital Camera", "Professional 24-70mm F/2.8 Zoom Lens",
    "Carbon Fiber Heavy Duty Camera Tripod", "3-Axis Motorized Gimbal Stabilizer", "4K Waterproof Action Adventure Camera",
    "High-Speed V90 128GB SDXC Memory Card", "Bi-Color LED Video Studio Panel Light", "Shotgun Directional Camera Microphone",
    "Waterproof Camera Backpack with Dividers", "Vintage Leather Camera Neck Strap", "Wireless Flash Speedlite Remote",
    "Macro Prime 50mm Portrait Lens", "Drone 4K Quadcopter with Obstacle Sensing", "Lens Cleaning Kit with Blower",
    "Variable ND Neutral Density Filter", "Camera Battery Grip Dual Power Pack", "Quick Release Metal Arca Plate",
    "Ring Light 18-inch with Tripod Stand", "Folding Portable Photo Studio Lightbox", "Telephoto 70-200mm Stabilized Lens",
    "Cinematic Softbox Diffuser Dome", "Rugged Pelican-Style Equipment Case", "Underwater Camera Diving Housing",
    "Remote Shutter Wireless Intervalometer", "Wide Angle 16-35mm Landscape Lens"
  ],
  "Men's Fashion": [
    "Classic Oxford Cotton Slim-Fit Shirt", "Vintage Denim Trucker Jacket", "Tailored Stretch Chino Pants",
    "Merino Wool Crewneck Luxury Sweater", "Casual Linen Summer Short Sleeve Shirt", "Water-Resistant Windbreaker Jacket",
    "Premium Heavyweight Cotton T-Shirt", "Formal Slim-Cut Two-Piece Suit Blazer", "Fleece Lined Athletic Joggers",
    "Ribbed Knit Thermal Pullover", "Relaxed Fit Cargo Utility Pants", "Classic Polo Shirt with Contrast Collar",
    "Genuine Leather Biker Jacket", "Corduroy Button-Down Casual Shirt", "Modern Fit Straight Leg Jeans",
    "Waterproof Hooded Rain Parka", "Waffle Knit Long Sleeve Henley", "Casual Drawstring Beach Shorts",
    "Cashmere Blend Overcoat Long Coat", "Breathable Mesh Active Gym Tee", "Vintage Wash Graphic Tee",
    "Stretch Denim Western Shirt", "Lightweight Puffer Insulated Vest", "Elastic Waist Everyday Trousers",
    "Premium Cotton Flannel Plaid Shirt", "Tailored Casual Wool Blend Blazer"
  ],
  "Women's Fashion": [
    "Elegant Floral Midi Wrap Dress", "Cashmere Blend Turtleneck Knit Sweater", "High-Waist Wide Leg Pleated Trousers",
    "Tailored Double-Breasted Trench Coat", "Casual Cotton Oversized Button-Down", "Satin Silk Cami Slip Dress",
    "Classic High-Rise Skinny Stretch Jeans", "Boho Embroidered Summer Maxi Dress", "Cropped Denim Trucker Jacket",
    "Soft Modal Loungewear Two-Piece Set", "A-Line Flared Knee Length Skirt", "Chiffon Ruffle V-Neck Blouse",
    "Cozy Cable Knit Chunky Cardigan", "Waterproof Quilted Winter Puffer Jacket", "Pleated Velvet Evening Cocktail Dress",
    "Athletic High-Impact Sports Bra", "High-Rise Seamless Workout Leggings", "Linen Blend Summer Romper Jumpsuit",
    "Structured Single-Breasted Office Blazer", "Tiered Ruffled Bohemian Sundress", "Vintage Inspired Denim Jumpsuit",
    "Fleece Lined Warm Winter Leggings", "Off-Shoulder Ribbed Knit Sweater", "French Terry Drawstring Hoodie Dress",
    "Classic Cotton Boatneck Striped Top", "Sophisticated Silk Button-Up Shirt"
  ],
  "Footwear & Sneakers": [
    "Retro Air Cushion Running Sneakers", "Classic Low-Top Canvas Casual Shoes", "Handcrafted Leather Chelsea Boots",
    "Breathable Knit Ultra Comfort Trainers", "Lightweight Trail Running Hiking Shoes", "Minimalist White Leather Tennis Sneakers",
    "Sport Sandals with Arch Support", "Waterproof Outdoor Trekking Boots", "Slip-On Memory Foam Walking Shoes",
    "Premium Italian Suede Penny Loafers", "Chunky Sole Streetwear Dad Sneakers", "Equestrian Style Leather Riding Boots",
    "High-Top Skateboard Canvas Sneakers", "Breathable Mesh Athletic Gym Shoes", "Comfort Foam Slide Sandal Slippers",
    "Formal Oxford Brogue Dress Shoes", "Winter Warm Fur Lined Snow Boots", "Shock Absorbing Marathon Road Runners",
    "Woven Espadrilles Casual Summer Shoes", "Vintage Retro Runner Lifestyle Shoes", "Water-Friendly Aqua Beach Shoes",
    "Orthopedic Support Daily Walking Shoes", "Platform Sole Casual Sneakers", "Rugged Work Boots Steel Toe",
    "High-Performance Basketball Sneakers", "Double Monk Strap Leather Shoes"
  ],
  "Luxury Watches": [
    "Automatic Mechanical Skeleton Watch", "Chronograph Tachymeter Stainless Watch", "Submariner Dive Watch 300M Waterproof",
    "Minimalist Bauhaus Sapphire Leather Watch", "Moonphase Calendar Luxury Dress Watch", "Vintage Pilot Aviator Leather Watch",
    "Rose Gold Bezel Diamond Accent Watch", "Titanium Lightweight Field Watch", "Tourbillon Movement Masterpiece Watch",
    "All-Black Ceramic Luxury Chronometer", "Sunburst Blue Dial Quartz Watch", "Dual-Time GMT World Timer Watch",
    "Cushion Case Retro Racing Watch", "Military Green Canvas Strap Watch", "Perpetual Calendar Swiss Style Watch",
    "Bronze Case Patina Explorer Watch", "Slimline Dress Watch Ultra-Thin 6mm", "Gold Plated Link Bracelet Watch",
    "Open Heart Automatic Precision Watch", "Exotic Carbon Fiber Dial Sports Watch", "Nato Strap Casual Everyday Watch",
    "Mother of Pearl Luxury Women's Watch", "Cushion Shaped Vintage Chronograph", "Luminous Hands Tactical Mission Watch",
    "Swiss Quartz Water Resistant Watch", "Hand-Wound Heritage Collector Watch"
  ],
  "Bags & Backpacks": [
    "Waterproof Urban Commuter Laptop Backpack", "Full-Grain Leather Executive Briefcase", "Lightweight Packable Travel Duffel Bag",
    "Anti-Theft RFID Travel Daypack", "Vintage Canvas Messenger Shoulder Bag", "Crossbody Everyday Sling Chest Pack",
    "Rolling Carry-On Hardshell Luggage", "Minimalist Leather Tote Shopping Bag", "Water-Resistant Gym Duffel with Shoe Pocket",
    "Multi-Compartment Camera Gear Backpack", "Compact Belt Bag Waist Fanny Pack", "Waxed Canvas Heavy-Duty Weekender",
    "Ergonomic Hiking Rucksack 45L", "Convertible 3-Way Laptop Briefcase", "Drawstring Lightweight Sports Sackpack",
    "Chic Quilted Chain Crossbody Bag", "Insulated Lunch Cooler Backpack", "Organizer Tech Pouch Travel Case",
    "Vintage Leather Satchel School Bag", "Sleek Carbon Texture Commute Bag", "Expandable Rolling Suitcase TSA Lock",
    "Boho Woven Straw Beach Tote", "Waterproof Dry Bag River Rafting Sack", "Tactical Molle Attachment Daypack",
    "Ultra-Slim Executive Document Folder", "Soft Leather Slouchy Hobo Bag"
  ],
  "Sunglasses & Eyewear": [
    "Classic Polarized Aviator Sunglasses", "Vintage Wayfarer UV400 Sunglasses", "Round Retro Metal Wireframe Glasses",
    "Sport Wrap-Around Cycling Sunglasses", "Oversized Square Gradient Sun Glasses", "Blue Light Blocking Computer Glasses",
    "Clubmaster Browline Half-Frame Glasses", "Cat-Eye Glamorous Fashion Sunglasses", "Hexagonal Geometric Rimless Shades",
    "Floating Polarized Water Sport Glasses", "Wooden Bamboo Arm Eco Sunglasses", "Mirror Coated Snow Ski Goggles",
    "Ultra-Light Titanium Reading Glasses", "Tortoiseshell Classic Acetate Frames", "Photochromic Transition Smart Lenses",
    "Driving Anti-Glare Yellow Night Glasses", "Futuristic Shield Monolens Sunglasses", "Matte Black Tactical Shooting Eyewear",
    "Steampunk Side Shield Vintage Sunglasses", "Rimless Minimalist Clear Lenses", "Slim Oval 90s Retro Sunglasses",
    "Foldable Pocket Travel Sunglasses", "Magnetic Clip-On Sun Shade Glasses", "Crystal Clear Acetate Modern Frames",
    "Sport Polarized Fishing Eyewear", "Fashion Designer Butterfly Sunglasses"
  ],
  "Jewelry & Accessories": [
    "18K Gold Plated Minimalist Chain Necklace", "Sterling Silver Cubic Zirconia Tennis Bracelet", "Classic Stainless Steel Cuban Link Chain",
    "Hammered Textured Titanium Band Ring", "Natural Freshwater Pearl Stud Earrings", "Handmade Braided Leather Magnetic Bracelet",
    "Vintage Locket Pendant Photo Keepsake", "Crystal Drop Dangle Evening Earrings", "Engraved Inspirational Cuff Bangle",
    "Solitaire Simulated Diamond Ring", "Black Onyx Stone Signet Ring", "Layered Celestial Coin Pendant Necklace",
    "Surgical Steel Huggie Hoop Earrings", "Polished Stainless Cufflinks Set", "Bohemian Beaded Multi-Wrap Bracelet",
    "Initial Letter Personalized Necklace", "Rose Gold Plated Stackable Rings", "Chunky Gold Twist Statement Hoops",
    "Obsidian Healing Crystal Protection Amulet", "Mesh Magnetic Stainless Watch Band", "Tie Clip Bar Formal Suit Accessory",
    "Delicate Beaded Anklet Beach Jewelry", "Zodiac Sign Constellation Pendant", "Turquoise Gemstone Vintage Feather Ring",
    "Crown King Skull Gothic Signet Ring", "Interlocking Double Circle Pendant"
  ],
  "Beauty & Skincare": [
    "Hyaluronic Acid Hydrating Face Serum", "Vitamin C Brightening Daily Moisturizer", "Gentle Foaming Tea Tree Face Cleanser",
    "SPF 50+ Invisible Matte Sunscreen", "Retinol Night Repair Anti-Aging Cream", "Exfoliating AHA BHA Peeling Solution",
    "Rosewater Refreshing Facial Toner Mist", "Nourishing Avocado Eye Cream with Peptides", "Organic Cold-Pressed Argan Hair Oil",
    "Clay Detoxifying Pore Minimizing Mask", "Volumizing Waterproof Long Lash Mascara", "Matte Liquid Long-Wear Lipstick Set",
    "Hydrogel Collagen Under-Eye Patches", "Centella Asiatica Calming Soothing Gel", "Silk Touch Makeup Setting Powder",
    "Professional 12-Piece Makeup Brush Set", "Tinted Lip & Cheek Stain Natural Blush", "Ultra-Moisturizing Shea Body Butter",
    "Micro-Needle Derma Roller for Face", "Biotin Keratin Hair Growth Mask", "Charcoal Deep Blackhead Peel-Off Mask",
    "Brightening Vitamin E Night Oil Elixir", "Waterproof Precision Liquid Eyeliner Pen", "Hydrating Coconut Sheet Mask 10-Pack",
    "Niacinamide 10% Blemish Control Drops", "All-in-One BB Cream Moisturizing Tint"
  ],
  "Fragrances & Perfumes": [
    "Eau De Parfum Amber & Vanilla Woods", "Fresh Ocean Breeze Citrus Cologne", "Smoky Oud & Royal Rose Intense Perfume",
    "Sensual White Musk Floral Eau De Toilette", "Spiced Tobacco & Dark Leather Cologne", "Crisp Bergamot & Green Tea Fragrance",
    "Sweet Lavender & Sandalwood Body Spray", "Exotic Vetiver & Cedarwood Men's Parfum", "Midnight Jasmine & Blackcurrant Perfume",
    "Patchouli & Warm Spices Arabian Blend", "Italian Neroli & Blood Orange Cologne", "Cashmere Wood & White Amber Perfume",
    "Tropical Coconut & Island Vanilla Mist", "Sparkling Pink Peony & Peach Perfume", "Aquatic Marine Deep Blue Sport Cologne",
    "Dark Cherry & Almond Liqueur Eau De Parfum", "Cardamom & Coffee Bean Rich Scent", "Golden Honey & Orange Blossom Fragrance",
    "Fresh Rain & Morning Pine Cologne", "Royal Saffron & Oriental Amber Extract", "Citrus Grapefruit & Basil Cologne",
    "Velvet Orchid & Truffle Luxe Perfume", "Bourbon Vanilla & Oak Aged Cologne", "Wild Blackberry & Bay Leaf Fragrance",
    "Clean Linen & Cotton Flower Body Mist", "Magnetic Midnight Musk Intense EDP"
  ],
  "Home Decor & Living": [
    "Nordic Ceramic Minimalist Flower Vase", "Warm Ambient LED Bedside Lamp with Touch", "Handwoven Macrame Wall Hanging Art",
    "Soft Plush Faux Fur Throw Blanket", "Aromatherapy Ultrasonic Essential Oil Diffuser", "Floating Rustic Wood Wall Shelves Set",
    "Vintage Sunburst Brass Wall Accent Mirror", "Boho Embroidered Linen Cushion Covers", "Scented Soy Wax Pillar Candles Gift Set",
    "Modern Abstract Canvas Oil Painting", "Indoor Ceramic Plant Pot with Stand", "Battery Operated Fairy String Curtain Lights",
    "Handmade Moroccan Geometric Floor Rug", "Cast Iron Antique Style Door Bell", "Crystal Himalayan Pink Salt Rock Lamp",
    "Magnetic Key Rack with Mail Holder", "Woven Cotton Rope Laundry Storage Basket", "Abstract Human Silhouette Metal Wall Art",
    "Decorative Velvet Round Floor Pouf", "Antique Gold Picture Frame Gallery Set", "Stained Glass Hanging Sun Catcher",
    "Marble Coaster Set with Gold Trim", "Modernist Black Metal Candle Holders", "Botanical Eucalyptus Dried Flower Bouquet",
    "LED Digital Wooden Alarm Clock with Temp", "Zen Garden Desktop Sand Meditation Kit"
  ],
  "Kitchen & Dining": [
    "Forged Damascus Steel Chef's Knife 8-inch", "Non-Stick Ceramic Coating Frying Pan", "Electric Rapid Boil Glass Kettle with LED",
    "Cold Brew Coffee Maker Glass Pitcher", "Double-Wall Insulated Stainless Steel Tumbler", "Cast Iron Pre-Seasoned Dutch Oven 5Qt",
    "Manual Burr Coffee Hand Grinder", "Natural Bamboo Cutting Board with Grooves", "Silicone Heat Resistant Cooking Utensils Set",
    "Digital High Precision Kitchen Food Scale", "Stainless Steel Salt & Pepper Gravity Mills", "Airtight Food Storage Containers 7-Piece",
    "Professional Compact Immersion Hand Blender", "Stoneware Dinnerware Set 16-Piece Service", "Vacuum Wine Bottle Stopper & Pump",
    "Ultra-Sharp Stainless Steel Mandoline Slicer", "Silicone Reusable Baking Mats Set of 3", "Multi-Tier Stainless Steamer Cooking Pot",
    "Cast Iron Reversible Stove Griddle Pan", "Crystal Stemmed Wine Glasses Set of 4", "Stainless Steel Mixing Bowls with Lids",
    "BPA-Free Compact Personal Smoothie Blender", "Ceramic Ramen Noodle Bowl with Chopsticks", "Automatic Wine Opener Rechargeable Kit",
    "Heavy Duty Kitchen Poultry Shears", "French Press Coffee & Tea Maker 34oz"
  ],
  "Furniture": [
    "Mid-Century Modern Velvet Accent Armchair", "Solid Oak Wood Round Coffee Table", "Ergonomic High-Back Executive Office Chair",
    "Industrial Metal Frame Bookshelf 5-Tier", "Minimalist Floating TV Console Entertainment Unit", "Solid Pine Wood 6-Drawer Dresser",
    "Adjustable Electric Standing Desk 55-inch", "Tufted Velvet Upholstered Platform Bed Frame", "Reversible L-Shaped Corner Sectional Sofa",
    "Foldable Space-Saving Dining Table Set", "Rustic Farmhouse Entryway Shoe Bench", "Nightstand Side Table with USB Charging",
    "Swivel Bar Stools Adjustable Height Set of 2", "Modern Nesting Side End Tables Set of 3", "Ergonomic Memory Foam Recliner Chair",
    "Console Table with Tempered Glass Top", "Kids Wooden Study Table with Storage", "Outdoor Wicker Patio Conversation Bistro Set",
    "Full Length Arched Floor Standing Mirror", "Wall Mounted Fold-Down Murphy Desk", "Geometric Cube Storage Bookcase Organizer",
    "Convertible Folding Futon Sofa Sleeper Bed", "Rattan Cane Weave Headboard Queen Size", "Metal Frame Hallway Coat Hat Tree Rack",
    "Leatherette Folding Storage Ottoman Bench", "Modern Round Glass Dining Table 4-Seater"
  ],
  "Sports & Fitness": [
    "Adjustable Quick-Select Dumbbells 50Lbs", "High-Density Non-Slip Yoga Exercise Mat", "Heavy-Duty Resistance Loop Bands Set of 5",
    "Smart Speed Jump Rope with Counter", "Stainless Steel Insulated Sports Shaker Bottle", "Deep Tissue Percussion Muscle Massage Gun",
    "Inflatable Stand-Up Paddle Board Kit", "Folding Magnetic Resistance Exercise Bike", "Anti-Burst Fitness Stability Balance Ball",
    "Breathable Compression Knee Support Sleeves", "Tactical Military Hydration Backpack Water Bladder", "Pro Grip Foam Padded Weightlifting Gloves",
    "Ab Roller Wheel with Knee Mat", "Olympic Barbell Clamps Quick Release Collars", "High Bounce Tennis Balls 12-Can Pack",
    "Lightweight Aluminum Trekking Walking Poles", "Adjustable Aerobic Step Exercise Platform", "Suspension Bodyweight Training Straps Kit",
    "Heavy Bag Boxing Gloves 14oz Sparring", "Swim Goggles Anti-Fog UV Protection Set", "Trail Running Hydration Vest Pack 5L",
    "Agility Ladder Speed Training Footwork Kit", "Doorway Pull-Up Chin-Up Multi-Grip Bar", "Foam Roller Muscle Recovery Trigger Point",
    "Quick-Dry Microfiber Gym Sports Towels", "Thermal Running Headband Ear Warmer"
  ],
  "Automotive & Gadgets": [
    "Dual 4K Front and Rear Dash Camera GPS", "High-Power Cordless Handheld Car Vacuum", "Portable Digital Tire Inflator Air Pump",
    "Universal Magnetic Phone Mount for Car Air Vent", "Quick Charge 3.0 Dual USB Car Charger Adapter", "Bluetooth 5.3 FM Transmitter Audio Adapter",
    "Heavy-Duty Car Trunk Cargo Organizer Box", "All-Weather Waterproof Rubber Car Floor Mats", "Scratch Repair Compound Polishing Wax Kit",
    "Car Battery Jump Starter Power Bank 2000A", "Ceramic Coating Paint Sealant Spray 16oz", "Microfiber Car Detailing Wash Mitts & Towels",
    "OBD2 Bluetooth Vehicle Diagnostic Scanner Tool", "Windshield Sunshade Reflective UV Foldable", "Leather Car Seat Cushion Comfort Pad",
    "Headrest Tablet Holder Mount for Backseat", "Emergency Roadside Safety Assistance Tool Kit", "Solar Powered Car Air Purifier Ionizer",
    "Tire Pressure Monitoring System TPMS Wireless", "Car Trash Can with Lid Leakproof Organizer", "Interior RGB LED Strip Lighting with App Control",
    "Blind Spot Wide Angle Stick-On Mirrors", "High-Pressure Snow Foam Car Wash Cannon", "Steering Wheel Lock Anti-Theft Security Bar",
    "Under-Hood LED Work Light Rechargeable Magnetic", "Compact Auto Window Breaker Seatbelt Cutter"
  ]
}

const runSeeder = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...")
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected successfully!")

    console.log("Clearing existing products, categories, brands...")
    await Product.deleteMany({})
    await Category.deleteMany({})
    await Brand.deleteMany({})

    console.log("Creating categories...")
    const insertedCategories = await Category.insertMany(categoryData)
    const categoryMap = {}
    insertedCategories.forEach(c => {
      categoryMap[c.name] = c._id
    })

    console.log("Creating brands...")
    const insertedBrands = await Brand.insertMany(brandNames.map(name => ({ name })))
    const brandIds = insertedBrands.map(b => b._id)

    console.log("Generating 520+ products with rich data and working images...")
    const allProducts = []

    for (const cat of categoryData) {
      const catName = cat.name
      const catId = categoryMap[catName]
      const titles = productTitles[catName] || []
      const images = imagePools[catName] || []

      titles.forEach((title, index) => {
        // Pick images deterministically from pool
        const primaryImg = images[index % images.length]
        const secImg1 = images[(index + 1) % images.length]
        const secImg2 = images[(index + 2) % images.length]
        const secImg3 = images[(index + 3) % images.length]

        // Pick a brand
        const brandId = brandIds[(index + titles.length) % brandIds.length]

        // Generate realistic pricing
        const basePrice = Math.floor(Math.random() * 450) + 25
        const discount = Math.floor(Math.random() * 30) + 5
        const stock = Math.floor(Math.random() * 120) + 15

        allProducts.push({
          title: title,
          description: `Premium quality ${title.toLowerCase()}. Engineered for superior performance, premium durability, and daily elegance. Includes authentic manufacturer warranty, hassle-free returns, and fast express shipping.`,
          price: basePrice,
          discountPercentage: discount,
          category: catId,
          brand: brandId,
          stockQuantity: stock,
          thumbnail: primaryImg,
          images: [primaryImg, secImg1, secImg2, secImg3],
          isDeleted: false
        })
      })
    }

    console.log(`Generated ${allProducts.length} products. Inserting into database...`)
    await Product.insertMany(allProducts)

    console.log("==================================================")
    console.log(`SUCCESS! Inserted:`)
    console.log(`- Categories: ${insertedCategories.length}`)
    console.log(`- Brands: ${insertedBrands.length}`)
    console.log(`- Products: ${allProducts.length}`)
    console.log("==================================================")

    process.exit(0)
  } catch (err) {
    console.error("Error during seeding:", err)
    process.exit(1)
  }
}

runSeeder()
