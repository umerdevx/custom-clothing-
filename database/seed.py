import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database.database import Base, engine, AsyncSessionLocal
from models.models import Product, FabricOption, StitchStyle, PrintMethod, Faq, Inventory


async def create_tables():
    print("Creating database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables created successfully!")


async def seed_data():
    async with AsyncSessionLocal() as session:

        # ── 1. Products (20 per category × 4 categories = 80 total) ──────────

        tshirts = [
            Product(product_id="tshirt",              name="Aura Premium Streetwear Tee",        category="T-Shirt",        gender="Men",      base_price=1200.0, discount_percent=0.0,  description="Heavyweight 240GSM boxy-fit tee with drop shoulders and double-needle hem.",                             image_url="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="womens_tee",           name="Aura Fitted Women's Tee",            category="T-Shirt",        gender="Women",    base_price=1100.0, discount_percent=15.0, description="Soft 180GSM fitted cotton tee with flattering cut for everyday style.",                                  image_url="https://images.unsplash.com/photo-1594938298603-c8148c4b4f41?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="kids_tee",             name="Aura Kids Graphic Tee",              category="T-Shirt",        gender="Children", base_price=700.0,  discount_percent=0.0,  description="Soft 160GSM kids cotton tee with vibrant screen-print graphics.",                                       image_url="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="tshirt_oversized",     name="Aura Oversized Drop-Shoulder Tee",   category="T-Shirt",        gender="Unisex",   base_price=1300.0, discount_percent=0.0,  description="Relaxed 260GSM oversized silhouette with raw-edge hem and extended shoulders.",                        image_url="https://images.unsplash.com/photo-1583743814966-8d39c8b5f4d2?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="tshirt_polo",          name="Aura Classic Polo Tee",              category="T-Shirt",        gender="Men",      base_price=1400.0, discount_percent=0.0,  description="Piqué-weave polo with ribbed collar, two-button placket, and side vents.",                             image_url="https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="tshirt_sleeveless",    name="Aura Muscle Fit Sleeveless Tee",     category="T-Shirt",        gender="Men",      base_price=950.0,  discount_percent=0.0,  description="200GSM combed cotton sleeveless tee cut for an athletic silhouette.",                                  image_url="https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="tshirt_longsleeve",    name="Aura Long-Sleeve Layering Tee",      category="T-Shirt",        gender="Unisex",   base_price=1350.0, discount_percent=0.0,  description="Lightweight 190GSM long-sleeve tee ideal for layering or standalone wear.",                            image_url="https://images.unsplash.com/photo-1604644401890-0bd678c83788?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="tshirt_crop",          name="Aura Women's Crop Tee",              category="T-Shirt",        gender="Women",    base_price=1050.0, discount_percent=10.0, description="170GSM cropped tee with a clean scoop neck and ribbed cuffs.",                                         image_url="https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="tshirt_raglan",        name="Aura Raglan Baseball Tee",           category="T-Shirt",        gender="Unisex",   base_price=1250.0, discount_percent=0.0,  description="Three-quarter raglan sleeve tee in contrast body/sleeve colorway.",                                    image_url="https://images.unsplash.com/photo-1503341455253-b2522382cc2c?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="tshirt_ringer",        name="Aura Ringer Tee",                    category="T-Shirt",        gender="Unisex",   base_price=1150.0, discount_percent=0.0,  description="Retro-inspired ringer tee with contrast collar and sleeve bands.",                                     image_url="https://images.unsplash.com/photo-1523381210434-271e8be8a52f?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="tshirt_vneck",         name="Aura V-Neck Essential Tee",          category="T-Shirt",        gender="Men",      base_price=1100.0, discount_percent=0.0,  description="210GSM combed cotton v-neck tee with taped shoulder seams.",                                           image_url="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="tshirt_pique",         name="Aura Piqué Performance Tee",         category="T-Shirt",        gender="Men",      base_price=1500.0, discount_percent=0.0,  description="Moisture-wicking piqué knit tee engineered for active performance.",                                   image_url="https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="tshirt_tiedye",        name="Aura Tie-Dye Festival Tee",          category="T-Shirt",        gender="Unisex",   base_price=1400.0, discount_percent=5.0,  description="Hand-dyed 220GSM oversized tee with each piece carrying a unique spiral pattern.",                     image_url="https://images.unsplash.com/photo-1594938374182-a57f31e23f5a?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="tshirt_henley",        name="Aura Henley Button-Neck Tee",        category="T-Shirt",        gender="Men",      base_price=1300.0, discount_percent=0.0,  description="230GSM henley tee with three-button placket and ribbed sleeve cuffs.",                                 image_url="https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="tshirt_vintage",       name="Aura Vintage Washed Tee",            category="T-Shirt",        gender="Unisex",   base_price=1350.0, discount_percent=0.0,  description="Garment-washed 240GSM cotton tee with a lived-in, faded aesthetic.",                                  image_url="https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="tshirt_pocket",        name="Aura Chest Pocket Everyday Tee",     category="T-Shirt",        gender="Unisex",   base_price=1200.0, discount_percent=0.0,  description="220GSM single-pocket tee with a minimalist chest patch pocket detail.",                               image_url="https://images.unsplash.com/photo-1503341455253-b2522382cc2c?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="tshirt_kids_polo",     name="Aura Kids Polo Tee",                 category="T-Shirt",        gender="Children", base_price=800.0,  discount_percent=0.0,  description="Soft piqué kids polo with ribbed collar and two-button placket.",                                     image_url="https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="tshirt_women_vneck",   name="Aura Women's V-Neck Slim Tee",       category="T-Shirt",        gender="Women",    base_price=1050.0, discount_percent=0.0,  description="180GSM slim-fit women's v-neck tee with side-seam shaping.",                                          image_url="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="tshirt_longline",      name="Aura Longline Curved-Hem Tee",       category="T-Shirt",        gender="Unisex",   base_price=1250.0, discount_percent=0.0,  description="Extended 250GSM longline tee with curved hem and side splits.",                                       image_url="https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="tshirt_compression",   name="Aura Compression Base-Layer Tee",    category="T-Shirt",        gender="Unisex",   base_price=1600.0, discount_percent=0.0,  description="Four-way stretch compression tee with flatlock seams for zero friction.",                              image_url="https://images.unsplash.com/photo-1520975954732-35dd22299614?w=500&auto=format&fit=crop&q=60"),
        ]

        hoodies = [
            Product(product_id="hoodie",               name="Aura Signature Oversized Hoodie",    category="Hoodie",         gender="Unisex",   base_price=2500.0, discount_percent=10.0, description="Ultra-soft fleece hoodie with double-lined hood and kangaroo pocket.",                                  image_url="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="womens_hoodie",        name="Aura Cropped Women's Hoodie",        category="Hoodie",         gender="Women",    base_price=2200.0, discount_percent=0.0,  description="Cozy cropped fleece hoodie with ribbed cuffs and relaxed silhouette.",                                 image_url="https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="hoodie_zip",           name="Aura Full-Zip Heavyweight Hoodie",   category="Hoodie",         gender="Men",      base_price=2800.0, discount_percent=0.0,  description="380GSM full-zip hoodie with metal YKK zipper and fleece-backed interior.",                             image_url="https://images.unsplash.com/photo-1509942774862-2b5f14a68ca5?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="hoodie_sherpa",        name="Aura Sherpa-Lined Hoodie",           category="Hoodie",         gender="Unisex",   base_price=3200.0, discount_percent=0.0,  description="Shell exterior with bonded sherpa lining for peak winter warmth.",                                     image_url="https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="hoodie_kids",          name="Aura Kids Pullover Hoodie",          category="Hoodie",         gender="Children", base_price=1500.0, discount_percent=0.0,  description="300GSM kids fleece hoodie with flat drawcord and pouch pocket.",                                       image_url="https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="hoodie_tech",          name="Aura Tech Fleece Hoodie",            category="Hoodie",         gender="Men",      base_price=3000.0, discount_percent=0.0,  description="Engineered tech fleece with laser-cut perforations for regulated temperature.",                        image_url="https://images.unsplash.com/photo-1565693413579-8ff3fdc1b03b?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="hoodie_loopback",      name="Aura Loopback Cotton Hoodie",        category="Hoodie",         gender="Unisex",   base_price=2600.0, discount_percent=0.0,  description="360GSM loopback cotton with a smooth face and brushed back for warmth.",                               image_url="https://images.unsplash.com/photo-1548036161-96383a52e8e1?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="hoodie_halfzip",       name="Aura Half-Zip Sweatshirt",           category="Hoodie",         gender="Unisex",   base_price=2400.0, discount_percent=0.0,  description="Classic half-zip sweatshirt with ribbed collar and cuffs.",                                           image_url="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="hoodie_vintage",       name="Aura Vintage Wash Hoodie",           category="Hoodie",         gender="Unisex",   base_price=2700.0, discount_percent=0.0,  description="Garment-dyed 350GSM hoodie with a faded, worn-in aesthetic.",                                         image_url="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="hoodie_athletic",      name="Aura Athletic Performance Hoodie",   category="Hoodie",         gender="Unisex",   base_price=2900.0, discount_percent=0.0,  description="Moisture-wicking stretch fleece hoodie built for training and gym sessions.",                          image_url="https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="hoodie_slimwomen",     name="Aura Slim-Fit Women's Hoodie",       category="Hoodie",         gender="Women",    base_price=2300.0, discount_percent=0.0,  description="320GSM slim-fit hoodie with a tailored waist and soft brushed interior.",                              image_url="https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="hoodie_tiedye",        name="Aura Tie-Dye Oversized Hoodie",      category="Hoodie",         gender="Unisex",   base_price=2600.0, discount_percent=5.0,  description="Hand-dyed oversized hoodie with spiral tie-dye pattern on heavy fleece.",                              image_url="https://images.unsplash.com/photo-1509942774862-2b5f14a68ca5?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="hoodie_thermal",       name="Aura Thermal Lined Winter Hoodie",   category="Hoodie",         gender="Men",      base_price=3500.0, discount_percent=0.0,  description="400GSM thermal-bonded winter hoodie with an insulated quilted lining.",                                image_url="https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="hoodie_pocketzip",     name="Aura Zip-Pocket Utility Hoodie",     category="Hoodie",         gender="Men",      base_price=2800.0, discount_percent=0.0,  description="Multi-pocket utility hoodie with secure zip chest and side pockets.",                                  image_url="https://images.unsplash.com/photo-1565693413579-8ff3fdc1b03b?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="hoodie_essential",     name="Aura Essential French Terry Hoodie", category="Hoodie",         gender="Unisex",   base_price=2200.0, discount_percent=0.0,  description="Lightweight 280GSM French terry hoodie for year-round comfort.",                                      image_url="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="hoodie_coach",         name="Aura Coach Pullover Hoodie",         category="Hoodie",         gender="Unisex",   base_price=2400.0, discount_percent=0.0,  description="Woven nylon shell hoodie with printed back graphics and adjustable hem cord.",                         image_url="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="hoodie_cropzip_women", name="Aura Women's Cropped Zip Hoodie",    category="Hoodie",         gender="Women",    base_price=2500.0, discount_percent=0.0,  description="Cropped full-zip fleece hoodie with ribbed waistband for a sporty look.",                             image_url="https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="hoodie_kids_zip",      name="Aura Kids Full-Zip Hoodie",          category="Hoodie",         gender="Children", base_price=1700.0, discount_percent=0.0,  description="300GSM kids zip hoodie with contrast zipper and kangaroo pocket.",                                    image_url="https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="hoodie_club",          name="Aura Club Fleece Hoodie",            category="Hoodie",         gender="Unisex",   base_price=2300.0, discount_percent=0.0,  description="340GSM club-weight fleece pullover with embroidered chest logo placement.",                            image_url="https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="hoodie_graphic",       name="Aura Back-Graphic Statement Hoodie", category="Hoodie",         gender="Unisex",   base_price=2700.0, discount_percent=0.0,  description="360GSM hoodie with full-back graphic print area for bold custom designs.",                             image_url="https://images.unsplash.com/photo-1509942774862-2b5f14a68ca5?w=500&auto=format&fit=crop&q=60"),
        ]

        jackets = [
            Product(product_id="jacket",               name="Aura Technical Windbreaker",         category="Jacket",         gender="Men",      base_price=3500.0, discount_percent=0.0,  description="Weatherproof ripstop shell with flatlock sealing and mesh insulation.",                                 image_url="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="jacket_bomber",        name="Aura Satin Bomber Jacket",           category="Jacket",         gender="Unisex",   base_price=4000.0, discount_percent=0.0,  description="Satin-shell bomber with ribbed collar, cuffs, and hem with contrast lining.",                         image_url="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="jacket_varsity",       name="Aura Varsity Letterman Jacket",      category="Jacket",         gender="Unisex",   base_price=4500.0, discount_percent=0.0,  description="Wool-blend body with leather sleeves, snap buttons, and chenille letter patch.",                       image_url="https://images.unsplash.com/photo-1548036161-96383a52e8e1?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="jacket_denim",         name="Aura Raw-Selvedge Denim Jacket",     category="Jacket",         gender="Unisex",   base_price=3800.0, discount_percent=0.0,  description="14oz Japanese-inspired selvedge denim jacket with copper rivets and chest pockets.",                   image_url="https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="jacket_fleece",        name="Aura Polar Fleece Zip Jacket",       category="Jacket",         gender="Unisex",   base_price=3200.0, discount_percent=0.0,  description="Anti-pill polar fleece full-zip jacket with stand collar and zip pockets.",                            image_url="https://images.unsplash.com/photo-1548036161-96383a52e8e1?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="jacket_puffer",        name="Aura Quilted Puffer Jacket",         category="Jacket",         gender="Unisex",   base_price=4800.0, discount_percent=0.0,  description="Diamond-quilted puffer jacket with 120g polyester fill and water-repellent shell.",                    image_url="https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="jacket_rain",          name="Aura Waterproof Rain Shell",         category="Jacket",         gender="Unisex",   base_price=4200.0, discount_percent=0.0,  description="20K waterproof rated 3-layer shell with fully taped seams and pit-zip vents.",                        image_url="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="jacket_coach",         name="Aura Nylon Coach Jacket",            category="Jacket",         gender="Unisex",   base_price=3600.0, discount_percent=0.0,  description="Lightweight nylon coach jacket with snap closure and pouch pocket.",                                   image_url="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="jacket_anorak",        name="Aura Half-Zip Anorak",               category="Jacket",         gender="Unisex",   base_price=3400.0, discount_percent=0.0,  description="Nylon ripstop anorak with half-zip closure, large kangaroo pocket, and hood.",                        image_url="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="jacket_track",         name="Aura Retro Track Jacket",            category="Jacket",         gender="Unisex",   base_price=3000.0, discount_percent=5.0,  description="Tricot-lined track jacket with contrast piping and snap-button front.",                                image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="jacket_biker_women",   name="Aura Women's Biker Jacket",          category="Jacket",         gender="Women",    base_price=4200.0, discount_percent=0.0,  description="Asymmetric-zip faux-leather biker jacket with quilted shoulder panels.",                               image_url="https://images.unsplash.com/photo-1548036161-96383a52e8e1?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="jacket_kids_bomber",   name="Aura Kids Bomber Jacket",            category="Jacket",         gender="Children", base_price=2500.0, discount_percent=0.0,  description="Kids satin bomber with embroidered back patch and ribbed trim.",                                       image_url="https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="jacket_softshell",     name="Aura Softshell Performance Jacket",  category="Jacket",         gender="Men",      base_price=3800.0, discount_percent=0.0,  description="4-way stretch softshell jacket with DWR coating and bonded fleece lining.",                            image_url="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="jacket_stadium",       name="Aura Stadium Snap Jacket",           category="Jacket",         gender="Unisex",   base_price=4000.0, discount_percent=0.0,  description="Wool-blend stadium jacket with snap closure and large back print area.",                               image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="jacket_utility",       name="Aura Multi-Pocket Utility Jacket",   category="Jacket",         gender="Men",      base_price=4500.0, discount_percent=0.0,  description="Cargo-style jacket with six zip-secure pockets and detachable hood.",                                  image_url="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="jacket_sherpa",        name="Aura Sherpa Trucker Jacket",         category="Jacket",         gender="Unisex",   base_price=4200.0, discount_percent=0.0,  description="Denim-shell trucker jacket with full sherpa lining and contrast stitching.",                           image_url="https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="jacket_military",      name="Aura Military Field Jacket",         category="Jacket",         gender="Men",      base_price=4600.0, discount_percent=0.0,  description="M65-inspired field jacket with interior lining, storm flap, and epaulettes.",                          image_url="https://images.unsplash.com/photo-1548036161-96383a52e8e1?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="jacket_crop_women",    name="Aura Women's Cropped Windbreaker",   category="Jacket",         gender="Women",    base_price=3200.0, discount_percent=10.0, description="Cropped nylon windbreaker with hood and elasticated waistband.",                                       image_url="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="jacket_packable",      name="Aura Ultra-Light Packable Jacket",   category="Jacket",         gender="Unisex",   base_price=3600.0, discount_percent=0.0,  description="30D ripstop nylon packable jacket that stuffs into its own chest pocket.",                             image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="jacket_letter",        name="Aura Wool Letter Jacket",            category="Jacket",         gender="Men",      base_price=5000.0, discount_percent=0.0,  description="Boiled-wool body with leather sleeves, satin lining, and custom letter patches.",                      image_url="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=60"),
        ]

        sports_uniforms = [
            Product(product_id="uniform",              name="Aura V-Neck Athletic Jersey",        category="Sports Uniform", gender="Unisex",   base_price=1800.0, discount_percent=0.0,  description="Interlock polyester mesh jersey with anti-bacterial dry-fit weave.",                                   image_url="https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="uniform_cricket",      name="Aura Cricket Pro Jersey",            category="Sports Uniform", gender="Men",      base_price=2200.0, discount_percent=0.0,  description="Full-sublimation cricket jersey with moisture control and UV protection.",                              image_url="https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="uniform_football",     name="Aura Football Sublimated Kit",       category="Sports Uniform", gender="Unisex",   base_price=2000.0, discount_percent=0.0,  description="Full-sublimation football shirt with ventilated mesh side panels.",                                    image_url="https://images.unsplash.com/photo-1517466787-6c2e3e3b2f8d?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="uniform_basketball",   name="Aura Basketball Mesh Jersey",        category="Sports Uniform", gender="Unisex",   base_price=1900.0, discount_percent=0.0,  description="Reversible dual-color basketball jersey with open-mesh fabric for breathability.",                     image_url="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="uniform_hockey",       name="Aura Field Hockey Jersey",           category="Sports Uniform", gender="Unisex",   base_price=2100.0, discount_percent=0.0,  description="Lightweight field hockey jersey with reinforced shoulder panels and custom sublimation.",               image_url="https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="uniform_tennis",       name="Aura Tennis Performance Top",        category="Sports Uniform", gender="Unisex",   base_price=2000.0, discount_percent=0.0,  description="Stretch-piqué tennis polo with moisture-wicking properties and mesh underarms.",                       image_url="https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="uniform_cycling",      name="Aura Cycling Aero Jersey",           category="Sports Uniform", gender="Unisex",   base_price=2500.0, discount_percent=0.0,  description="Aero-cut cycling jersey with three rear pockets, silicone hem gripper, and UPF50+.",                   image_url="https://images.unsplash.com/photo-1517466787-6c2e3e3b2f8d?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="uniform_kabaddi",      name="Aura Kabaddi Wrestling Vest",        category="Sports Uniform", gender="Men",      base_price=1600.0, discount_percent=0.0,  description="Reinforced-neck cotton-spandex vest built for contact sports durability.",                             image_url="https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="uniform_polo_sport",   name="Aura Sports Polo Shirt",             category="Sports Uniform", gender="Unisex",   base_price=1800.0, discount_percent=0.0,  description="Moisture-wicking piqué polo for corporate sports events and team branding.",                           image_url="https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="uniform_rugby",        name="Aura Rugby Pro Jersey",              category="Sports Uniform", gender="Men",      base_price=2300.0, discount_percent=0.0,  description="Heavy-duty 230GSM rugby jersey with reinforced seams and stretch panels.",                             image_url="https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="uniform_volleyball",   name="Aura Volleyball Sublimated Jersey",  category="Sports Uniform", gender="Unisex",   base_price=1900.0, discount_percent=0.0,  description="Fully sublimated volleyball jersey with open-mesh back for ventilation.",                              image_url="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="uniform_badminton",    name="Aura Badminton Performance Tee",     category="Sports Uniform", gender="Unisex",   base_price=1800.0, discount_percent=0.0,  description="Ultra-light 140GSM dry-fit tee with anti-odor treatment for racket sports.",                          image_url="https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="uniform_running",      name="Aura Marathon Running Vest",         category="Sports Uniform", gender="Unisex",   base_price=1700.0, discount_percent=0.0,  description="120GSM featherlight running singlet with reflective strip and number bib loops.",                      image_url="https://images.unsplash.com/photo-1517466787-6c2e3e3b2f8d?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="uniform_athletics",    name="Aura Track & Field Vest",            category="Sports Uniform", gender="Unisex",   base_price=1600.0, discount_percent=0.0,  description="IAAF-spec sublimated athletics vest with front number window and mesh back.",                          image_url="https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="uniform_women_gym",    name="Aura Women's Gym Crop Jersey",       category="Sports Uniform", gender="Women",    base_price=1900.0, discount_percent=0.0,  description="Cropped 4-way stretch gym jersey with racerback cut and seamless underarms.",                         image_url="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="uniform_kids_football",name="Aura Kids Football Kit",             category="Sports Uniform", gender="Children", base_price=1400.0, discount_percent=0.0,  description="Mini sublimated football kit with moisture management and club-ready design.",                          image_url="https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="uniform_esports",      name="Aura eSports Team Jersey",           category="Sports Uniform", gender="Unisex",   base_price=2200.0, discount_percent=0.0,  description="Gaming jersey with breathable mesh back, sponsor zones, and sublimated side panels.",                  image_url="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="uniform_polo_women",   name="Aura Women's Sports Polo",           category="Sports Uniform", gender="Women",    base_price=1800.0, discount_percent=0.0,  description="Tailored dry-fit women's polo with contrast trim and side-seam shaping.",                             image_url="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="uniform_wrestling",    name="Aura Wrestling Compression Singlet", category="Sports Uniform", gender="Men",      base_price=2000.0, discount_percent=0.0,  description="FILA-compliant 4-way stretch singlet with reinforced crotch gusset.",                                 image_url="https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=500&auto=format&fit=crop&q=60"),
            Product(product_id="uniform_swimming",     name="Aura Competitive Swim Suit",         category="Sports Uniform", gender="Unisex",   base_price=2800.0, discount_percent=0.0,  description="Chlorine-resistant 200GSM polyester swimsuit with compression panels and flat seams.",                 image_url="https://images.unsplash.com/photo-1517466787-6c2e3e3b2f8d?w=500&auto=format&fit=crop&q=60"),
        ]

        products = tshirts + hoodies + jackets + sports_uniforms

        # ── 2. Fabric Options (4 types × 5 grades = 20 fabrics) ──────────────

        GSM_LEVELS = [150, 180, 220, 240, 300]
        fabric_specs = [
            ("cotton",    "Combed Cotton",       1.0),
            ("polyester", "Dry-Fit Polyester",   0.9),
            ("blended",   "Poly-Cotton Blend",   1.1),
            ("fleece",    "Brushed Fleece",       1.3),
        ]
        fabrics = []
        for ftype, name, base_mult in fabric_specs:
            for i, gsm in enumerate(GSM_LEVELS):
                grade = i + 1
                mult  = round(base_mult * (1 + i * 0.15), 2)
                fabrics.append(FabricOption(
                    name=f"{name} (Grade {grade} — {gsm} GSM)",
                    type=ftype,
                    grade=grade,
                    price_multiplier=mult,
                    available_qty=100.0,
                ))

        # ── 3. Stitch Styles ──────────────────────────────────────────────────

        stitches = [
            StitchStyle(name="Overlock Stitching",  description="Standard durable serge stitch",         price_add=0.0),
            StitchStyle(name="Flatlock Stitching",  description="No-chafe seam for activewear",          price_add=100.0),
            StitchStyle(name="Chain Stitching",     description="Authentic vintage single-needle chain",  price_add=150.0),
        ]

        # ── 4. Print Methods ──────────────────────────────────────────────────

        prints = [
            PrintMethod(name="Direct-To-Garment",  description="Vivid photographic inkjet print",        price_add=350.0),
            PrintMethod(name="Screen Printing",    description="Classic thick plastisol inks",            price_add=200.0),
            PrintMethod(name="Embroidery",         description="Premium stitched texture on fabric",      price_add=500.0),
            PrintMethod(name="Heat Transfer",      description="Flexible sporty vinyl print",             price_add=250.0),
        ]

        # ── 5. FAQs ───────────────────────────────────────────────────────────

        faqs = [
            Faq(
                question="delivery time shipping cost timeline",
                answer="Standard delivery across Pakistan takes 7–10 working days. Free shipping on orders over PKR 5,000; otherwise a flat rate of PKR 250 applies.",
            ),
            Faq(
                question="return exchange policy size guide",
                answer="We offer a 14-day return and exchange policy for items in original condition. Custom apparel with personalised logos can only be returned if there is a manufacturing defect.",
            ),
            Faq(
                question="bulk order pricing discounts wholesale",
                answer="Yes! Orders of 10–49 units receive a 10% discount; 50+ units receive a 20% discount. Contact us for corporate or institutional bulk quotes.",
            ),
            Faq(
                question="care instructions wash guide laundry",
                answer="For DTG or screen-printed items, wash inside-out in cold water. Do not tumble-dry on high heat. Iron inside-out only, avoiding direct contact with prints or embroidery.",
            ),
        ]

        # ── 6. Inventory ──────────────────────────────────────────────────────

        inventory = [
            Inventory(item_type="Fabric",        item_name="Combed Cotton Roll",           qty_available=500.0,  reorder_level=100.0),
            Inventory(item_type="Fabric",        item_name="Brushed Fleece Roll",          qty_available=85.0,   reorder_level=120.0),
            Inventory(item_type="Fabric",        item_name="Dry-Fit Polyester Roll",       qty_available=300.0,  reorder_level=80.0),
            Inventory(item_type="Fabric",        item_name="Poly-Cotton Blend Roll",       qty_available=200.0,  reorder_level=60.0),
            Inventory(item_type="Dye",           item_name="Neon Teal Pigment",            qty_available=15.0,   reorder_level=5.0),
            Inventory(item_type="Dye",           item_name="Carbon Black Reactive Dye",   qty_available=40.0,   reorder_level=10.0),
            Inventory(item_type="Print Ink",     item_name="DTG Ink Cartridge",            qty_available=3.0,    reorder_level=10.0),
            Inventory(item_type="Print Ink",     item_name="Plastisol Screen-Print Ink",  qty_available=25.0,   reorder_level=8.0),
            Inventory(item_type="Stitch Thread", item_name="High-Tensile Thread Spool",   qty_available=1200.0, reorder_level=300.0),
            Inventory(item_type="Stitch Thread", item_name="Embroidery Thread Set",       qty_available=80.0,   reorder_level=20.0),
            Inventory(item_type="Hardware",      item_name="YKK Metal Zippers",           qty_available=500.0,  reorder_level=100.0),
            Inventory(item_type="Hardware",      item_name="Snap Buttons Pack",           qty_available=1000.0, reorder_level=200.0),
        ]

        # ── Seed guard — skip if products already exist ───────────────────────
        print("Seeding database tables...")
        res = await session.execute(select(Product))
        if res.scalars().first():
            print("Database already contains data, skipping seed.")
            return

        session.add_all(products)
        session.add_all(fabrics)
        session.add_all(stitches)
        session.add_all(prints)
        session.add_all(faqs)
        session.add_all(inventory)
        await session.commit()
        print(f"Database seeded: {len(products)} products, {len(fabrics)} fabrics, "
              f"{len(stitches)} stitch styles, {len(prints)} print methods, "
              f"{len(faqs)} FAQs, {len(inventory)} inventory items.")


async def main():
    await create_tables()
    await seed_data()


if __name__ == "__main__":
    asyncio.run(main())
