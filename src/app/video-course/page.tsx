import type { Metadata } from "next";
import ProductPage from "@/components/ProductPage";
import { products } from "@/content/products";

const product = products.videoCourse;

export const metadata: Metadata = { title: product.title, description: product.intro };

export default function VideoCoursePage() {
  return <ProductPage product={product} />;
}
