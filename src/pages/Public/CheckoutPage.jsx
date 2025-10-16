import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CheckoutForm />
      <Footer />
    </div>
  );
}
