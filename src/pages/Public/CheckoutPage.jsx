import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { Helmet } from "react-helmet-async";

export default function CheckoutPage() {
  return (
    <>
      <Helmet>
        <title>Checkout - প্রতিজ্ঞা | অর্ডার সম্পন্ন করুন</title>
        <meta
          name="description"
          content="প্রতিজ্ঞার চেকআউট পেজ। কোর্স এবং বই অর্ডার করুন। SSL কমার্জ এবং ক্যাশ অন ডেলিভারি পেমেন্ট অপশন। নিরাপদ এবং সুরক্ষিত পেমেন্ট প্রসেস।"
        />
        <meta
          property="og:title"
          content="চেকআউট - প্রতিজ্ঞা | অর্ডার সম্পন্ন করুন"
        />
        <meta
          property="og:description"
          content="প্রতিজ্ঞার চেকআউট পেজ। কোর্স এবং বই অর্ডার করুন। SSL কমার্জ এবং ক্যাশ অন ডেলিভারি পেমেন্ট অপশন।"
        />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:url" content="https://www.protigya.com/checkout" />
        <link rel="canonical" href="https://www.protigya.com/checkout" />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            <CheckoutForm />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
