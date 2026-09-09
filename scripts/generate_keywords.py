import itertools
import csv
import os

# 1. Intent / Prefixes
intents = [
    "kom dame", "bhalo", "best", "online", "notun", "sundor", "cheap rate e",
    "original", "branded", "export quality", "wholesale", "retail", "kinbo",
    "premium", "low price", "exclusive", "fashion", "stylish", "discount", "budget"
]

# 2. Attributes / Styles / Fabrics
attributes = [
    "cotton", "drop shoulder", "oversized", "heavy gsm", "plain", "printed",
    "back print", "casual", "formal", "denim", "linen", "georgette", "silk",
    "embroidered", "loose fit", "summer", "winter", "eid collection", "puja collection",
    "stylish", "simple", "party wear", "daily wear", "vintage", "aesthetic"
]

# 3. Core Clothing Items
items = [
    "t shirt", "panjabi", "shirt", "polo shirt", "three piece", "kurti", "sharee",
    "hoodie", "jacket", "jeans pant", "cargo pant", "chino pant", "borka", "abaya",
    "hijab", "joggers", "trouser", "kabli set", "fotua", "sweatshirt"
]

# 4. Suffixes / Intent / Locations
suffixes = [
    "bd", "dhaka", "online kinbo", "er dam koto", "price in bd", "cash on delivery",
    "home delivery", "dokan", "shop bd", "offer", "combo pack", "chittagong",
    "review", "collection 2026", "kom price", "store", "page", "delivery free",
    "sosta", "kothay pabo"
]

# Total possible = 20 * 25 * 20 * 20 = 200,000 permutations
output_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "adwords_100k_keywords.csv")
target_count = 100000

print(f"Generating {target_count} Banglish keywords into {output_file}...")

with open(output_file, mode="w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["Keyword", "Match Type"])
    
    count = 0
    for p1, p2, p3, p4 in itertools.product(intents, attributes, items, suffixes):
        keyword = f"{p1} {p2} {p3} {p4}".strip()
        # Writing Phrase Match format for Google Ads
        writer.writerow([f'"{keyword}"', "Phrase"])
        count += 1
        if count >= target_count:
            break

print(f"Done! Successfully saved {count} keywords to {output_file}")
