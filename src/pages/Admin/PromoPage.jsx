import PromoManagement from "@/components/Admin/Promo/PromoManagement";
import AdminLayout from "@/components/shared/AdminLayout";

export default function AdminPromoPage() {
  return (
    <AdminLayout>
      <PromoManagement useLayout={false} />
    </AdminLayout>
  );
}
