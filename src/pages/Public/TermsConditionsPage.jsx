import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { Card, CardContent } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";

export default function TermsConditionsPage() {
  return (
    <>
      <Helmet>
        <title>শর্তাবলী - প্রতিজ্ঞা | Terms & Conditions</title>
        <meta
          name="description"
          content="প্রতিজ্ঞা শিক্ষা প্ল্যাটফর্মের ব্যবহারের শর্তাবলী এবং নিয়মাবলী। কোর্স এবং বই কেনার আগে শর্তাবলী পড়ুন।"
        />
        <meta
          property="og:title"
          content="শর্তাবলী - প্রতিজ্ঞা | Terms & Conditions"
        />
        <meta
          property="og:description"
          content="প্রতিজ্ঞা শিক্ষা প্ল্যাটফর্মের ব্যবহারের শর্তাবলী এবং নিয়মাবলী।"
        />
        <meta property="og:image" content="/logo.png" />
        <meta
          property="og:url"
          content="https://www.protigya.com/terms-conditions"
        />
        <link
          rel="canonical"
          href="https://www.protigya.com/terms-conditions"
        />
      </Helmet>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-primary mb-8">
              Terms & Conditions
            </h1>

            <Card className="shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <div className="prose max-w-none">
                  <section className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                      1. Acceptance of Terms
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      By accessing and using প্রতিজ্ঞা (Protigya) website and
                      services, you accept and agree to be bound by the terms
                      and provision of this agreement.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                      2. Course Access and Usage
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                      Upon successful payment and enrollment:
                    </p>
                    <ul className="list-disc pl-6 text-sm sm:text-base text-muted-foreground space-y-2">
                      <li>
                        You will receive access to purchased courses for the
                        duration specified at the time of purchase
                      </li>
                      <li>
                        Course materials are for personal use only and cannot be
                        shared or redistributed
                      </li>
                      <li>
                        We reserve the right to update course content to
                        maintain relevance and quality
                      </li>
                      <li>
                        Access may be revoked for violation of these terms
                      </li>
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                      3. Book Orders and Delivery
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                      For physical book orders:
                    </p>
                    <ul className="list-disc pl-6 text-sm sm:text-base text-muted-foreground space-y-2">
                      <li>
                        Books will be delivered within 3-4 working days inside
                        Dhaka
                      </li>
                      <li>Outside Dhaka delivery may take 4-6 working days</li>
                      <li>
                        Delivery charges are additional and will be clearly
                        mentioned during checkout
                      </li>
                      <li>
                        We are not responsible for delays caused by courier
                        services or external factors
                      </li>
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                      4. Payment Terms
                    </h2>
                    <ul className="list-disc pl-6 text-sm sm:text-base text-muted-foreground space-y-2">
                      <li>
                        All payments must be made in Bangladeshi Taka (BDT)
                      </li>
                      <li>
                        We accept payments through SSL Commerz and Cash on
                        Delivery for books
                      </li>
                      <li>
                        Course access is granted immediately upon successful
                        payment verification
                      </li>
                      <li>All prices are inclusive of applicable taxes</li>
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                      5. User Responsibilities
                    </h2>
                    <ul className="list-disc pl-6 text-sm sm:text-base text-muted-foreground space-y-2">
                      <li>
                        Provide accurate and complete information during
                        registration
                      </li>
                      <li>
                        Maintain confidentiality of your account credentials
                      </li>
                      <li>
                        Use the platform responsibly and not engage in any
                        illegal activities
                      </li>
                      <li>
                        Respect intellectual property rights of course materials
                      </li>
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                      6. Limitation of Liability
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      প্রতিজ্ঞা shall not be liable for any direct, indirect,
                      incidental, special, or consequential damages arising from
                      the use of our services. Our liability is limited to the
                      amount paid for the specific service.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                      7. Modifications to Terms
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      We reserve the right to modify these terms at any time.
                      Users will be notified of significant changes via email or
                      platform notifications.
                    </p>
                  </section>
                </div>
              </CardContent>
            </Card>
          </div>
          <ScrollToTop />
        </div>
      </main>
      <Footer />
    </>
  );
}
