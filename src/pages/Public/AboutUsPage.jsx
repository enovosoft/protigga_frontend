import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CONTACT, TEAM } from "@/config/data";
import { Building, MapPin } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function AboutUsPage() {
  return (
    <>
      <Helmet>
        <title>আমাদের সম্পর্কে - প্রতিজ্ঞা | About Us</title>
        <meta
          name="description"
          content="প্রতিজ্ঞা শিক্ষা প্ল্যাটফর্ম সম্পর্কে জানুন। আমাদের মিশন, ভিশন, টিম এবং বাংলাদেশের শীর্ষস্থানীয় অনলাইন শিক্ষা প্রদানকারী হিসেবে আমাদের যাত্রা।"
        />
        <meta
          property="og:title"
          content="আমাদের সম্পর্কে - প্রতিজ্ঞা | About Us"
        />
        <meta
          property="og:description"
          content="প্রতিজ্ঞা শিক্ষা প্ল্যাটফর্ম সম্পর্কে জানুন।"
        />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:url" content="https://www.protigya.com/about-us" />
        <link rel="canonical" href="https://www.protigya.com/about-us" />
      </Helmet>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
              About Us
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Company Card */}
            <Card className="col-span-1 lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-primary">Company Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium">Address</div>
                      <div>{CONTACT.address}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Building className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium">TIN</div>
                      <div>{CONTACT.tin}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 mt-2">
                    <div className="font-medium">Contact</div>
                    <div>
                      <div>
                        <a
                          href={`mailto:${CONTACT.email}`}
                          className="text-primary hover:underline"
                        >
                          {CONTACT.email}
                        </a>
                      </div>
                      <div>
                        <a
                          href={`tel:${CONTACT.phone}`}
                          className="text-primary hover:underline"
                        >
                          {CONTACT.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Management / Leadership */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="text-primary">
                  Leadership & Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {TEAM.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-start gap-4 p-3 rounded-md border border-border hover:shadow-sm transition-shadow bg-card"
                    >
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-muted sm:flex items-center justify-center hidden">
                        <img
                          src={member.image || "/logo.png"}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-semibold text-primary">
                              {member.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {member.role}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {member.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <ScrollToTop />s
      <Footer />
    </>
  );
}
