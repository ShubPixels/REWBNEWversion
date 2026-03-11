import ProductGrid from "@/components/product/ProductGrid";
import type { WpProductCardData } from "@/types/wp";

export interface RelatedProductsProps {
  products: WpProductCardData[];
  title?: string;
}

export default function RelatedProducts({ products, title = "Related Products" }: RelatedProductsProps) {
  if (!products.length) {
    return null;
  }

  return <ProductGrid title={title} products={products} />;
}
