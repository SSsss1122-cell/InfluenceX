
import { Suspense } from "react";
import ProductListing from "@/components/ProductListing";
import Footer from "@/components/Footer";

export default function ProductsPage() {
  return (
    <>
      <Suspense fallback={<div>Loading products...</div>}>
        <ProductListing />
      </Suspense>
      <Footer />
    </>
  );
}
