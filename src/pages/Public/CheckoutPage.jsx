import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <CheckoutForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
