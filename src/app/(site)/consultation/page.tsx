import type { Metadata } from "next";
import ProductPage from "@/components/ProductPage";
import { products } from "@/content/products";

const product = products.consultation;

export const metadata: Metadata = { title: product.metaTitle, description: product.intro };

export default function ConsultationPage() {
  return <ProductPage product={product} />;
}
