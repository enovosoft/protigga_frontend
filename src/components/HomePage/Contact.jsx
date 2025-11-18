import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CONTACT } from "@/config/data";
import {
  Building,
  Facebook,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Youtube,
} from "lucide-react";

function Contact() {
  return (
    <div className="py-6 lg:py-12 px-4 bg-secondary/10 rounded-lg w-full">
      <div className="text-center mb-8">
        <div className="text-2xl font-semibold text-primary mb-2 hover:scale-105 transition-transform duration-300 ">
          আমাদের সম্পর্কে
        </div>
        <div className="text-muted-foreground hover:text-foreground transition-colors duration-300">
          আমাদের সাথে যুক্ত থাকুন এবং আরও জানুন
        </div>
      </div>

      {/* Company Information Card */}
      <div className="mb-8 container mx-auto">
        <Card className="bg-card border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Building className="w-5 h-5" />
              প্রতিজ্ঞা - স্বপ্ন পূরণে
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              প্রতিজ্ঞা একটি অনলাইন শিক্ষা প্ল্যাটফর্ম যা শিক্ষার্থীদের জন্য
              মানসম্পন্ন কোর্স, বই এবং শিক্ষামূলক সামগ্রী প্রদান করে। আমাদের
              লক্ষ্য হল প্রতিটি শিক্ষার্থীকে তাদের স্বপ্ন অর্জনে সহায়তা করা।
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <div>
                  <span className="block font-medium">ঠিকানা:</span>
                  <span className="block text-muted-foreground">
                    {CONTACT.address}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building className="w-4 h-4 text-primary flex-shrink-0" />
                <div>
                  <span className="block font-medium">ট্রেড লাইসেন্স:</span>
                  <span className="block text-muted-foreground">
                    {CONTACT.tradeLicense}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <div>
                  <span className="block font-medium">ইমেইল:</span>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="block text-muted-foreground hover:text-primary transition-colors"
                  >
                    {CONTACT.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <div>
                  <span className="block font-medium">ফোন:</span>
                  <a
                    href={`tel:${CONTACT.phone}`}
                    className="block text-muted-foreground hover:text-primary transition-colors"
                  >
                    {CONTACT.phone}
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Social Media Section */}
      <div className="text-center mb-6">
        <div className="text-sm text-muted-foreground">
          আরও আপডেট পেতে আমাদের সোশ্যাল মিডিয়া ফলো করুন
        </div>
      </div>

      <div className="flex justify-center gap-6 flex-wrap">
        {/* YouTube Channel */}
        <a
          href={CONTACT.socialLinks.youtube}
          className="flex items-center gap-3 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg transition-colors duration-200 border border-red-200 hover:border-red-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Youtube className="w-6 h-6" />
          <span className="font-medium">YouTube</span>
        </a>

        {/* Facebook Page */}
        <a
          href={CONTACT.socialLinks.facebookPage}
          className="flex items-center gap-3 px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 rounded-lg transition-colors duration-200 border border-blue-200 hover:border-blue-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook className="w-6 h-6" />
          <span className="font-medium">Facebook Page</span>
        </a>

        {/* Facebook Profile */}
        <a
          href={CONTACT.socialLinks.facebookProfile}
          className="flex items-center gap-3 px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 rounded-lg transition-colors duration-200 border border-blue-200 hover:border-blue-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook className="w-6 h-6" />
          <span className="font-medium">Facebook Profile</span>
        </a>

        {/* WhatsApp */}
        <a
          href={CONTACT.socialLinks.whatsapp}
          className="flex items-center gap-3 px-6 py-3 bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 rounded-lg transition-colors duration-200 border border-green-200 hover:border-green-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="font-medium">WhatsApp</span>
        </a>
      </div>
    </div>
  );
}

export default Contact;
