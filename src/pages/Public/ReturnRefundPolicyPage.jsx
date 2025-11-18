import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { Card, CardContent } from "@/components/ui/card";

export default function ReturnRefundPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-primary mb-8">
              Return & Refund Policy
            </h1>

            <Card className="shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <div className="prose max-w-none">
                  <section className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                      1. Overview
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      At প্রতিজ্ঞা (Protigga), we strive to provide high-quality
                      educational content and books. This policy outlines our
                      return and refund procedures for both digital courses and
                      physical books.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                      2. Digital Course Refunds
                    </h2>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Refund Timeline:
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                        Refund requests must be made within{" "}
                        <strong>7 working days</strong> of purchase.
                      </p>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Eligible for Refund:
                      </h3>
                      <ul className="list-disc pl-6 text-sm sm:text-base text-muted-foreground space-y-2">
                        <li>
                          Technical issues preventing course access that cannot
                          be resolved
                        </li>
                        <li>
                          Course content significantly different from
                          description
                        </li>
                        <li>Duplicate purchase made by error</li>
                        <li>Payment charged incorrectly</li>
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Not Eligible for Refund:
                      </h3>
                      <ul className="list-disc pl-6 text-sm sm:text-base text-muted-foreground space-y-2">
                        <li>Course access after 7 working days of purchase</li>
                        <li>Change of mind or personal circumstances</li>
                        <li>Completion of more than 25% of course content</li>
                        <li>Violation of terms and conditions</li>
                      </ul>
                    </div>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                      3. Physical Book Returns
                    </h2>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Return Timeline:
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                        Books can be returned within{" "}
                        <strong>10 working days</strong> of delivery.
                      </p>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Return Conditions:
                      </h3>
                      <ul className="list-disc pl-6 text-sm sm:text-base text-muted-foreground space-y-2">
                        <li>
                          Books must be in original condition (unread, unmarked)
                        </li>
                        <li>Original packaging and invoice required</li>
                        <li>No damage, writing, or highlighting</li>
                        <li>Books delivered with defects or printing errors</li>
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Return Process:
                      </h3>
                      <ol className="list-decimal pl-6 text-sm sm:text-base text-muted-foreground space-y-2">
                        <li>
                          Contact our support team within the return timeline
                        </li>
                        <li>Provide order number and reason for return</li>
                        <li>Wait for return authorization and instructions</li>
                        <li>Ship the book using recommended courier service</li>
                        <li>
                          Refund will be processed after quality inspection
                        </li>
                      </ol>
                    </div>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                      4. Refund Processing
                    </h2>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Processing Timeline:
                      </h3>
                      <ul className="list-disc pl-6 text-sm sm:text-base text-muted-foreground space-y-2">
                        <li>
                          Refund requests are processed within{" "}
                          <strong>7-10 working days</strong>
                        </li>
                        <li>
                          Bank transfer refunds: 3-5 working days after
                          processing
                        </li>
                        <li>
                          Mobile banking refunds: 1-3 working days after
                          processing
                        </li>
                        <li>
                          Cash on Delivery returns: Refund via bank transfer
                          only
                        </li>
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Refund Method:
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        Refunds will be issued to the original payment method.
                        If the original method is not available, we will arrange
                        an alternative method in consultation with the customer.
                      </p>
                    </div>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                      5. How to Request Return/Refund
                    </h2>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Contact Information:
                      </h3>
                      <ul className="list-disc pl-6 text-sm sm:text-base text-muted-foreground space-y-2">
                        <li>Email: tazwoarbusiness@gmail.com</li>
                        <li>Phone: +880 1533-381836</li>
                      </ul>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Required Information:
                      </h3>
                      <ul className="list-disc pl-6 text-sm sm:text-base text-muted-foreground space-y-2">
                        <li>Order number or transaction ID</li>
                        <li>Registered email address</li>
                        <li>Detailed reason for return/refund</li>
                        <li>Supporting documentation (if applicable)</li>
                      </ul>
                    </div>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                      6. Shipping and Return Costs
                    </h2>
                    <ul className="list-disc pl-6 text-sm sm:text-base text-muted-foreground space-y-2">
                      <li>
                        Return shipping costs are borne by the customer unless
                        the return is due to our error
                      </li>
                      <li>We recommend using trackable shipping services</li>
                      <li>
                        Original shipping charges are non-refundable (except in
                        cases of our error)
                      </li>
                      <li>
                        Risk of loss during return shipping lies with the
                        customer
                      </li>
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">
                      7. Exceptions and Special Cases
                    </h2>
                    <ul className="list-disc pl-6 text-sm sm:text-base text-muted-foreground space-y-2">
                      <li>
                        Promotional or discounted items may have different
                        return policies
                      </li>
                      <li>
                        Bulk purchases may require special approval for returns
                      </li>

                      <li>
                        Custom or personalized materials are non-returnable
                      </li>
                    </ul>
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
