import PromoDialog from "@/components/Admin/Promo/PromoDialog";
import PromoTable, {
  PromoTableSkeleton,
} from "@/components/Admin/Promo/PromoTable";
import UserDashboardLayout from "@/components/shared/DashboardLayout";
import Pagination from "@/components/shared/Pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PromoManagement({ useLayout = true }) {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const response = await api.get("/promocodes");
      if (response.data.success) {
        let promos = response.data?.promocodes || [];

        promos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPromos(promos);
      }
    } catch (error) {
      console.error("Error fetching promos:", error);
      toast.error("Failed to fetch promo codes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleAdd = () => {
    setSelectedPromo(null);
    setDialogOpen(true);
  };

  const handleEdit = (promo) => {
    setSelectedPromo(promo);
    setDialogOpen(true);
  };

  const handleDeleteClick = (promo) => {
    setPromoToDelete(promo);
    setDeleteDialogOpen(true);
  };

  const handleSave = async (promoData) => {
    setSaving(true);
    try {
      let response;
      if (selectedPromo) {
        // Update existing promo
        response = await api.put("/promo-code", {
          ...promoData,
          promo_code_id: selectedPromo.promo_code_id,
        });
      } else {
        // Create new promo
        response = await api.post("/promo-code", promoData);
      }

      if (response.data.success) {
        await fetchPromos();
        return response.data;
      }
    } catch (error) {
      console.error("Save error:", error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!promoToDelete) return;

    setDeleting(true);
    try {
      const response = await api.delete("/promo-code", {
        data: {
          promo_code_id: promoToDelete.promo_code_id,
        },
      });

      toast.success(
        response.data?.message || "Promo code deleted successfully!"
      );
      setDeleteDialogOpen(false);
      setPromoToDelete(null);
      // Fetch promos again to update the list
      await fetchPromos();
    } catch (error) {
      await fetchPromos();

      console.error("Delete error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete promo code"
      );
    } finally {
      setDeleting(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(promos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPromos = promos.slice(startIndex, endIndex);

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Promo Codes Management
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage discount codes and promotional offers
          </p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Promo Code
        </Button>
      </div>

      {loading ? (
        <PromoTableSkeleton />
      ) : promos.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-lg border-2 border-dashed border-border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No promo codes yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first promo code!
          </p>
          <Button onClick={handleAdd} variant="outline" className="mt-2">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Promo
          </Button>
        </div>
      ) : (
        <>
          <PromoTable
            promos={currentPromos}
            startIndex={startIndex}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={promos.length}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <PromoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        promo={selectedPromo}
        onSave={handleSave}
        isLoading={saving}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the promo code{" "}
              <span className="font-semibold text-foreground">
                "{promoToDelete?.promo_code}"
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  return useLayout ? (
    <UserDashboardLayout>{content}</UserDashboardLayout>
  ) : (
    content
  );
}
