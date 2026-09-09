import { Metadata } from "next";
import ShopClientPage from "./ShopClientPage";

export const metadata: Metadata = {
  title: "Shop Collection",
  description: "Browse the latest collection of premium drop-shoulder oversized t-shirts and streetwear from Deshi Flex in Bangladesh.",
};

export default function Shop() {
  return <ShopClientPage />;
}
