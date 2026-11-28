import type { Metadata } from "next";
import CallBuyBox from "@/components/payments/CallBuyBox";
import ProductPage from "@/components/ProductPage";
import { products } from "@/content/products";

const product = products.consultation;

export const metadata: Metadata = { title: product.metaTitle, description: product.intro };

export default function ConsultationPage() {
  return <ProductPage product={product} buyBox={<CallBuyBox product={product} slug="consultation" />} />;
}
