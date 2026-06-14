import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import Base, engine, AsyncSessionLocal
from models.models import Product, FabricOption, StitchStyle, PrintMethod, Faq, Inventory

async def create_tables():
    print("Creating database tables...")
    async with engine.begin() as conn:
        # Drops tables if we want a fresh run (disabled by default)
        # await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    print("Tables created successfully!")

async def seed_data():
    async with AsyncSessionLocal() as session:
        # 1. Seed Products
        products = [
            Product(
                product_id="tshirt",
                name="Aura Premium Streetwear Tee",
                category="T-Shirt",
                gender="Men",
                base_price=1200.0,
                discount_percent=0.0,
                description="Heavyweight 240GSM cotton t-shirt with drop shoulders and a boxy fit.",
                image_url="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60"
            ),
            Product(
                product_id="hoodie",
                name="Aura Signature Oversized Hoodie",
                category="Hoodie",
                gender="Unisex",
                base_price=2500.0,
                discount_percent=10.0,
                description="Ultra-soft fleece hoodie featuring double-lined hood and kangaroo pocket.",
                image_url="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=60"
            ),
            Product(
                product_id="jacket",
                name="Aura Technical Windbreaker",
                category="Jacket",
                gender="Men",
                base_price=3500.0,
                discount_percent=0.0,
                description="Weatherproof ripstop shell jacket with flatlock sealing and mesh insulation.",
                image_url="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60"
            ),
            Product(
                product_id="uniform",
                name="Aura V-Neck Athletic Jersey",
                category="Sports Uniform",
                gender="Unisex",
                base_price=1800.0,
                discount_percent=0.0,
                description="Interlock polyester mesh jersey with anti-bacterial dry fit weave.",
                image_url="https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=500&auto=format&fit=crop&q=60"
            ),
            Product(
                product_id="womens_tee",
                name="Aura Fitted Women's Tee",
                category="T-Shirt",
                gender="Women",
                base_price=1100.0,
                discount_percent=15.0,
                description="Soft 180GSM fitted cotton tee with flattering cut, perfect for everyday style.",
                image_url="https://images.unsplash.com/photo-1594938298603-c8148c4b4f41?w=500&auto=format&fit=crop&q=60"
            ),
            Product(
                product_id="kids_tee",
                name="Aura Kids Graphic Tee",
                category="T-Shirt",
                gender="Children",
                base_price=700.0,
                discount_percent=0.0,
                description="Soft 160GSM kids cotton tee with vibrant screen-print graphics, durable and comfortable.",
                image_url="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500&auto=format&fit=crop&q=60"
            ),
            Product(
                product_id="womens_hoodie",
                name="Aura Cropped Women's Hoodie",
                category="Hoodie",
                gender="Women",
                base_price=2200.0,
                discount_percent=0.0,
                description="Cozy cropped fleece hoodie with ribbed cuffs, kangaroo pocket, and relaxed silhouette.",
                image_url="https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&auto=format&fit=crop&q=60"
            ),
        ]
        
        # 2. Seed Fabric Options
        GSM_LEVELS = [150, 180, 220, 240, 300]
        fabrics = []
        fabric_specs = [
            ("cotton", "Combed Cotton", 1.0),
            ("polyester", "Dry-Fit Polyester", 0.9),
            ("blended", "Poly-Cotton Blend", 1.1),
            ("fleece", "Brushed Fleece", 1.3)
        ]
        for ftype, name, base_mult in fabric_specs:
            for i, gsm in enumerate(GSM_LEVELS):
                grade = i + 1
                mult = round(base_mult * (1 + i * 0.15), 2)
                fabrics.append(FabricOption(
                    name=f"{name} ({gsm} GSM)",
                    type=ftype,
                    grade=grade,
                    price_multiplier=mult,
                    available_qty=100.0
                ))
                
        # 3. Seed Stitch Styles
        stitches = [
            StitchStyle(name="Flatlock Stitching", description="No chafing, robust", price_add=100.0),
            StitchStyle(name="Overlock Stitching", description="Standard durable", price_add=0.0),
            StitchStyle(name="Chain Stitching", description="Authentic vintage design", price_add=150.0)
        ]
        
        # 4. Seed Print Methods
        prints = [
            PrintMethod(name="Direct-To-Garment", description="Vivid photographic print", price_add=350.0),
            PrintMethod(name="Screen Printing", description="Classic thick inks", price_add=200.0),
            PrintMethod(name="Embroidery", description="Premium stitched texture", price_add=500.0),
            PrintMethod(name="Heat Transfer", description="Flexible sporty print", price_add=250.0)
        ]
        
        # 5. Seed FAQs
        faqs = [
            Faq(
                question="delivery time shipping cost timeline",
                answer="Standard delivery across Pakistan takes 7 to 10 working days. Free shipping is provided for orders exceeding PKR 5,000, otherwise flat rate of PKR 250 applies."
            ),
            Faq(
                question="return exchange policy size guide",
                answer="We offer a 14-day return and exchange policy for items in original condition. Custom apparel with personalized logos can only be returned if there is a manufacturing defect."
            ),
            Faq(
                question="bulk order pricing discounts wholesale",
                answer="Yes! We support bulk manufacturing. Orders of 10-49 units receive a 10% discount, and 50+ units receive a 20% discount."
            ),
            Faq(
                question="care instructions wash guide laundry",
                answer="For direct-to-garment or screen prints, wash inside out in cold water. Do not tumble dry on high heat. Iron inside-out to protect logos and prints."
            )
        ]
        
        # 6. Seed Inventory
        inventory = [
            Inventory(item_type="Fabric", item_name="Combed Cotton Roll", qty_available=500.0, reorder_level=100.0),
            Inventory(item_type="Fabric", item_name="Brushed Fleece Roll", qty_available=85.0, reorder_level=120.0),
            Inventory(item_type="Dye", item_name="Neon Teal Pigment", qty_available=15.0, reorder_level=5.0),
            Inventory(item_type="Print Ink", item_name="DTG Ink cartridge", qty_available=3.0, reorder_level=10.0),
            Inventory(item_type="Stitch Thread", item_name="High-Tensile Thread Spool", qty_available=1200.0, reorder_level=300.0)
        ]

        print("Seeding database tables...")
        # Check if already seeded to prevent duplicates
        from sqlalchemy import select
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
        print("Database seeded successfully!")

async def main():
    await create_tables()
    await seed_data()

if __name__ == "__main__":
    asyncio.run(main())
