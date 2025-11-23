import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { Card, CardContent } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Helmet>
        <title>গোপনীয়তা নীতি - প্রতিজ্ঞা | Privacy Policy</title>
        <meta
          name="description"
          content="প্রতিজ্ঞা শিক্ষা প্ল্যাটফর্মের গোপনীয়তা নীতি। আপনার ব্যক্তিগত তথ্য কীভাবে সংরক্ষণ এবং ব্যবহার করা হয় তা জানুন।"
        />
        <meta
          property="og:title"
          content="গোপনীয়তা নীতি - প্রতিজ্ঞা | Privacy Policy"
        />
        <meta
          property="og:description"
          content="প্রতিজ্ঞা শিক্ষা প্ল্যাটফর্মের গোপনীয়তা নীতি।"
        />
        <meta property="og:image" content="/logo.png" />
        <meta
          property="og:url"
          content="https://www.protigya.com/privacy-policy"
        />
        <link rel="canonical" href="https://www.protigya.com/privacy-policy" />
      </Helmet>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-primary mb-8">
              Privacy Policy
            </h1>

            <Card className="shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <div className="prose max-w-none">
                  <section className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                      1. Information We Collect
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                      প্রতিজ্ঞা (Protigya) collects information to provide
                      better services to our users. We collect information in
                      the following ways:
                    </p>

                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Personal Information:
                      </h3>
                      <ul className="list-disc pl-6 text-sm sm:text-base text-muted-foreground space-y-2">
                        <li>
                          Name and contact information (phone number, email
                          address)
                        </li>
                        <li>Billing and shipping addresses</li>
                        <li>
                          Payment information (processed securely through SSL
                          Commerz)
                        </li>
                        <li>Account credentials and profile information</li>
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Usage Information:
                      </h3>
                      <ul className="list-disc pl-6 text-sm sm:text-base text-muted-foreground space-y-2">
                        <li>Course progress and completion data</li>
                        <li>Learning preferences and behavior</li>
                        <li>Device information and browser type</li>
                        <li>IP address and location data</li>
                      </ul>
                    </div>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                      2. How We Use Your Information
                    </h2>
                    <ul className="list-disc pl-6 text-sm sm:text-base text-muted-foreground space-y-2">
                      <li>Provide and maintain our educational services</li>
                      <li>
                        Process payments and deliver purchased courses/books
                      </li>

                      <li>Improve our platform and user experience</li>
                      <li>Provide customer support and respond to inquiries</li>
                      <li>Prevent fraud and ensure platform security</li>
                      <li>Comply with legal obligations</li>
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                      3. Information Sharing
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                      We do not sell, trade, or rent your personal information
                      to third parties. We may share your information in the
                      following circumstances:
                    </p>
                    <ul className="list-disc pl-6 text-sm sm:text-base text-muted-foreground space-y-2">
                      <li>
                        With payment processors (SSL Commerz) for transaction
                        processing
                      </li>
                      <li>With delivery partners for book shipping</li>
                      <li>
                        With service providers who assist in platform operations
                      </li>
                      <li>When required by law or to protect our rights</li>
                      <li>With your explicit consent</li>
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                      4. Data Security
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                      We implement appropriate security measures to protect your
                      personal information:
                    </p>
                    <ul className="list-disc pl-6 text-sm sm:text-base text-muted-foreground space-y-2">
                      <li>SSL encryption for all data transmission</li>
                      <li>
                        Secure payment processing through verified gateways
                      </li>
                      <li>Regular security updates</li>
                      <li>
                        Limited access to personal data by authorized personnel
                        only
                      </li>
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                      5. Cookies and Tracking
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                      We use cookies and similar technologies to:
                    </p>
                    <ul className="list-disc pl-6 text-sm sm:text-base text-muted-foreground space-y-2">
                      <li>Remember your login information and preferences</li>
                      <li>Analyze platform usage and improve functionality</li>
                      <li>Provide personalized content recommendations</li>
                      <li>Ensure platform security and prevent fraud</li>
                    </ul>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-4">
                      You can control cookie settings through your browser
                      preferences.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                      6. Your Rights
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                      You have the following rights regarding your personal
                      information:
                    </p>
                    <ul className="list-disc pl-6 text-sm sm:text-base text-muted-foreground space-y-2">
                      <li>Access and review your personal data</li>

                      <li>Request deletion of your account and data</li>
                      <li>Opt-out of marketing communications</li>
                      <li>
                        Data portability (receive your data in a structured
                        format)
                      </li>
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                      7. Data Retention
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      We retain your personal information for as long as
                      necessary to provide our services and comply with legal
                      obligations. After account deletion, we may retain certain
                      information for legal compliance, fraud prevention, and
                      legitimate business purposes for a maximum of 10 years.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                      8. Children's Privacy
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Our services are not intended for children under 13 years
                      of age. We do not knowingly collect personal information
                      from children under 13. If you are a parent or guardian
                      and believe your child has provided personal information,
                      please contact us to have it removed.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                      9. International Data Transfers
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      Your information may be transferred to and processed in
                      countries other than your country of residence. We ensure
                      that such transfers comply with applicable data protection
                      laws and implement appropriate safeguards to protect your
                      information.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                      10. Changes to This Policy
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      We may update this Privacy Policy from time to time. We
                      will notify you of any significant changes by posting the
                      new policy on our website. Your continued use of our
                      services after such changes constitutes acceptance of the
                      updated policy.
                    </p>
                  </section>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <ScrollToTop />
      </main>
      <Footer />
    </>
  );
}
