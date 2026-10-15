export interface LookbookItem {
  id: number;
  image: string;
  title: string;
  category: 'all' | 'shirts' | 'kids' | 'bottoms' | 'tees';
  categoryLabel: string;
}

export const LOOKBOOK_ITEMS: LookbookItem[] = Array.from({ length: 96 }, (_, index) => {
  const num = index + 1;
  const idStr = String(num).padStart(2, '0');
  const image = `/products/product-${idStr}.jpeg`;

  let category: LookbookItem['category'] = 'tees';
  let categoryLabel = 'Designer Polo / Tee';
  let title = `Designer Collar Style #${idStr}`;

  if (num >= 1 && num <= 11) {
    category = 'shirts';
    categoryLabel = 'Denim Shirts';
    title = `Acid-Washed Denim Shirt Look #${idStr}`;
  } else if (num >= 12 && num <= 14) {
    category = 'kids';
    categoryLabel = 'Girls Streetwear';
    title = `Girls Floral Art & Cargo Set #${idStr}`;
  } else if (num >= 15 && num <= 23) {
    category = 'kids';
    categoryLabel = 'Boys Collection';
    title = `Boys Graphic & Embossed Set #${idStr}`;
  } else if (num >= 24 && num <= 32) {
    category = 'kids';
    categoryLabel = 'Kids Fleece Sets';
    title = `Kids Bunny Sweatshirt & Jogger #${idStr}`;
  } else if (num >= 33 && num <= 35) {
    category = 'kids';
    categoryLabel = 'Kids Collection';
    title = `Kids Sunflower Smile Set #${idStr}`;
  } else if (num >= 36 && num <= 62) {
    category = 'kids';
    categoryLabel = 'Kids Co-ords';
    title = `Kids Tropical & Streetwear Set #${idStr}`;
  } else if (num >= 63 && num <= 65) {
    category = 'bottoms';
    categoryLabel = 'Technical Bottoms';
    title = `FEIN Drawstring Technical Pants #${idStr}`;
  } else if (num >= 66 && num <= 80) {
    category = 'tees';
    categoryLabel = 'Polo Shirts';
    title = `Premium Gold Collar & Atlas Polo #${idStr}`;
  } else if (num === 81) {
    category = 'bottoms';
    categoryLabel = 'Casual Bottoms';
    title = `Relaxed Fit Drawstring Trousers #${idStr}`;
  } else if (num >= 82 && num <= 86) {
    category = 'tees';
    categoryLabel = 'Graphic Tees';
    title = `Vengeance Wolf Acid Wash Tee #${idStr}`;
  } else {
    category = 'tees';
    categoryLabel = 'Textured Polos';
    title = `Luxury Jacquard & Stripe Polo #${idStr}`;
  }

  return {
    id: num,
    image,
    title,
    category,
    categoryLabel
  };
});
