import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CONTACT } from "@/config/data";
import {
  Building,
  Facebook,
  Globe,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Users,
  Youtube
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
              আমাদের প্রতিষ্ঠাতা মোমেন তাজওয়ার মমিত, যিনি শিক্ষা ক্ষেত্রে একটি
              উজ্জ্বল ভবিষ্যত গড়ার জন্য প্রতিজ্ঞাবদ্ধ। আমাদের অফিস বাংলাদেশে
              অবস্থিত এবং আমরা সর্বদা শিক্ষার্থীদের সেবা দিতে প্রস্তুত। আমাদের
              থেকে অর্ডার করা বই ৭ দিনের ভিতর পৌঁছে যাবে তোমার ঠিকানায়।
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
                  {/* <span className="block font-medium">TIN:</span>
                  <span className="block text-muted-foreground">
                    {CONTACT.tin}
                  </span> */}
                  <span className="block font-medium">Trade License:</span>
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

      <div className="flex justify-center gap-4 flex-wrap">
        {/* Protigya YouTube Channel */}
        <a
          href={CONTACT.socialLinks.protigyaYoutube}
          className="flex items-center justify-center w-12 h-12 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-full transition-all duration-200 border border-red-200 hover:border-red-300 hover:scale-110"
          target="_blank"
          rel="noopener noreferrer"
          title="Protigya YouTube"
        >
          <Youtube className="w-6 h-6" />
        </a>

        {/* Momit's YouTube Channel */}
        <a
          href={CONTACT.socialLinks.youtube}
          className="flex items-center justify-center w-12 h-12 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-full transition-all duration-200 border border-red-200 hover:border-red-300 hover:scale-110"
          target="_blank"
          rel="noopener noreferrer"
          title="Momit's YouTube"
        >
          <Youtube className="w-6 h-6" />
        </a>

        {/* Protigya Facebook Page */}
        <a
          href={CONTACT.socialLinks.protigyaFacebookPage}
          className="flex items-center justify-center w-12 h-12 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 rounded-full transition-all duration-200 border border-blue-200 hover:border-blue-300 hover:scale-110"
          target="_blank"
          rel="noopener noreferrer"
          title="Protigya Facebook"
        >
          <Facebook className="w-6 h-6" />
        </a>

        {/* Momit's Facebook Page */}
        <a
          href={CONTACT.socialLinks.facebookPage}
          className="flex items-center justify-center w-12 h-12 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 rounded-full transition-all duration-200 border border-blue-200 hover:border-blue-300 hover:scale-110"
          target="_blank"
          rel="noopener noreferrer"
          title="Momit's Facebook"
        >
          <Facebook className="w-6 h-6" />
        </a>

        {/* Facebook Group */}
        <a
          href={CONTACT.socialLinks.facebookGroup}
          className="flex items-center justify-center w-12 h-12 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 rounded-full transition-all duration-200 border border-blue-200 hover:border-blue-300 hover:scale-110"
          target="_blank"
          rel="noopener noreferrer"
          title="Facebook Group"
        >
          <Users className="w-6 h-6" />
        </a>

        {/* Instagram */}
        <a
          href={CONTACT.socialLinks.instagram}
          className="flex items-center justify-center w-12 h-12 bg-pink-50 hover:bg-pink-100 text-pink-600 hover:text-pink-700 rounded-full transition-all duration-200 border border-pink-200 hover:border-pink-300 hover:scale-110"
          target="_blank"
          rel="noopener noreferrer"
          title="Instagram"
        >
          <Instagram className="w-6 h-6" />
        </a>

        {/* TikTok */}
        <a
          href={CONTACT.socialLinks.tiktok}
          className="flex items-center justify-center w-12 h-12 bg-gray-50 hover:bg-gray-100 text-gray-900 hover:text-black rounded-full transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:scale-110"
          target="_blank"
          rel="noopener noreferrer"
          title="TikTok"
        >
          <img src="/tiktok.png" alt="TikTok" className="w-6 h-6 object-contain" />
        </a>

        {/* WhatsApp */}
        <a
          href={CONTACT.socialLinks.whatsapp}
          className="flex items-center justify-center w-12 h-12 bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 rounded-full transition-all duration-200 border border-green-200 hover:border-green-300 hover:scale-110"
          target="_blank"
          rel="noopener noreferrer"
          title="WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </a>

        {/* Smart Shohay */}
        <a
          href={CONTACT.socialLinks.smartShohay}
          className="flex items-center justify-center w-12 h-12 bg-purple-50 hover:bg-purple-100 text-purple-600 hover:text-purple-700 rounded-full transition-all duration-200 border border-purple-200 hover:border-purple-300 hover:scale-110"
          target="_blank"
          rel="noopener noreferrer"
          title="Smart Shohay"
        >
          <Globe className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
}

export default Contact;
