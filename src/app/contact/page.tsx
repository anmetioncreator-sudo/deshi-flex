import { Metadata } from "next";
import ContactClientPage from "./ContactClientPage";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Deshi Flex for any questions about your order, sizing, or collection drops in Bangladesh.",
};

export default function Contact() {
  return <ContactClientPage />;
}
