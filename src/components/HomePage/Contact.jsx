import { Facebook, Mail, MessageCircle, Phone, Youtube } from "lucide-react";
import { motion } from "motion/react";

function Contact() {
  return (
    <motion.div
      className="py-6 lg:py-12 px-4 bg-secondary/10 rounded-lg w-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="text-center mb-8">
        <motion.h3
          className="text-2xl font-semibold text-primary mb-2 hover:scale-105 transition-transform duration-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          আমাদের সাথে যুক্ত থাকুন
        </motion.h3>
        <motion.p
          className="text-muted-foreground hover:text-foreground transition-colors duration-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        >
          আরও আপডেট পেতে আমাদের সোশ্যাল মিডিয়া ফলো করুন
        </motion.p>
      </div>

      <motion.div
        className="flex justify-center gap-6 flex-wrap"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
      >
        {/* YouTube Channel */}
        <a
          href="https://www.youtube.com/@momentazwoarmomit"
          className="flex items-center gap-3 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg transition-colors duration-200 border border-red-200 hover:border-red-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Youtube className="w-6 h-6" />
          <span className="font-medium">YouTube</span>
        </a>

        {/* Facebook Page */}
        <a
          href="https://www.facebook.com/Momentazwoarmomit"
          className="flex items-center gap-3 px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 rounded-lg transition-colors duration-200 border border-blue-200 hover:border-blue-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook className="w-6 h-6" />
          <span className="font-medium">Facebook Page</span>
        </a>

        {/* Facebook Profile */}
        <a
          href="https://www.facebook.com/Momentazwoarmomit"
          className="flex items-center gap-3 px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 rounded-lg transition-colors duration-200 border border-blue-200 hover:border-blue-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook className="w-6 h-6" />
          <span className="font-medium">Facebook Profile</span>
        </a>

        {/* WhatsApp */}
        <a
          href="https://wa.me/1533381836"
          className="flex items-center gap-3 px-6 py-3 bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 rounded-lg transition-colors duration-200 border border-green-200 hover:border-green-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="font-medium">WhatsApp</span>
        </a>
      </motion.div>

      <motion.div
        className="flex flex-col mt-6 gap-2 align-center justify-start"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.8 }}
      >
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
          <Mail className="w-4 h-4" />
          <span>ইমেইল: </span>
          <a
            href="mailto:tazwoarbusiness@gmail.com"
            className="text-primary hover:underline"
          >
            tazwoarbusiness@gmail.com
          </a>
        </p>
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
          <Phone className="w-4 h-4" />
          <span>ফোন: </span>
          <a href="tel:+8801533381836" className="text-primary hover:underline">
            +880 1533-381836
          </a>
        </p>
      </motion.div>
    </motion.div>
  );
}

export default Contact;
