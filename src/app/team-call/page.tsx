import type { Metadata } from "next";
import ProductPage from "@/components/ProductPage";
import { products } from "@/content/products";

const product = products.teamCall;

export const metadata: Metadata = { title: product.metaTitle, description: product.intro };

export default function TeamCallPage() {
  return <ProductPage product={product} />;
}
