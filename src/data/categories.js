import { products } from "./products";

const categoryMap = new Map();

products.forEach((product) => {
  const key = product.category.trim();

  if (!categoryMap.has(key)) {
    categoryMap.set(key, {
      id: categoryMap.size + 1,
      name: key,
      total: 0,
    });
  }

  categoryMap.get(key).total += 1;
});

export const categories = Array.from(categoryMap.values());
