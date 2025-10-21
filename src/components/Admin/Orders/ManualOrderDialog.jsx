import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

const manualOrderSchema = z.object({
  phone: z
    .string()
    .regex(
      /^\+8801\d{9}$/,
      "Phone must be a valid Bangladesh number (+8801xxxxxxxx)"
    ),
  // product_name removed - taken from selected book
  product_price: z.number().min(0, "Price must be positive"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  address: z.string().min(1, "Address is required"),
  Txn_ID: z.string().min(1, "Transaction ID is required"),
  book_id: z.string().min(1, "Book selection is required"),
  alternative_phone: z
    .string()
    .regex(
      /^\+8801\d{9}$/,
      "Phone must be a valid Bangladesh number (+8801xxxxxxxx)"
    )
    .optional()
    .or(z.literal("")),
  discount_amount: z.number().min(0, "Discount must be positive").default(0),
  paid_amount: z.number().min(0, "Paid amount must be positive").default(0),
  // after_discounted_amount removed; not required
  // discount percentage removed; only discount_amount is used
  book_order_status: z.enum(["confirmed", "pending", "failed", "cancelled"]),
  payment_status: z.enum([
    "PENDING",
    "SUCCESS",
    "FAILED",
    "REFUNDED",
    "CANCELLED",
  ]),
  delivery_method: z.enum(["inside_dhaka", "outside_dhaka", "sundarban"]),
  payment_method: z.enum([
    "BKASH",
    "NAGAD",
    "STRIPE",
    "SSL_COMMERZ",
    "CASH",
    "OTHER",
    "BANK",
  ]),
});

export default function ManualOrderDialog({ onOrderCreated }) {
  const [open, setOpen] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(manualOrderSchema),
    defaultValues: {
      phone: "",
      product_price: 0,
      quantity: 1,
      address: "",
      Txn_ID: "MANUAL",
      book_id: "",
      alternative_phone: "",
      discount_amount: 0,
      paid_amount: 0,
      book_order_status: "confirmed",
      payment_status: "SUCCESS",
      delivery_method: "inside_dhaka",
      payment_method: "BKASH",
    },
  });

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books");
      if (response.data.success) {
        setBooks(response.data.books || []);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Failed to fetch books");
    }
  };

  useEffect(() => {
    if (open) {
      fetchBooks();
    }
  }, [open]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data };
      payload["inside_dhaka"] = false;
      payload["outside_dhaka"] = false;
      payload["sundarban_courier"] = false;

      if (data.delivery_method === "inside_dhaka") {
        payload["inside_dhaka"] = true;
      } else if (data.delivery_method === "outside_dhaka") {
        payload["outside_dhaka"] = true;
      } else if (data.delivery_method === "sundarban") {
        payload["sundarban_courier"] = true;
      }

      const response = await api.post("/manual/book-order", payload);
      if (response.data.success) {
        toast.success(
          response.data?.message || "Manual order created successfully"
        );
        setOpen(false);
        form.reset();
        if (onOrderCreated) {
          onOrderCreated();
        }
      } else {
        toast.error(response.data.message || "Failed to create manual order");
      }
    } catch (error) {
      console.error("Error creating manual order:", error);
      toast.error(
        error.response?.data?.message || "Failed to create manual order"
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedBook = books.find(
    (book) => book.book_id === form.watch("book_id")
  );

  useEffect(() => {
    if (selectedBook) {
      // product_name is derived; no need to set
      form.setValue("product_price", selectedBook.price || 0);
    }
  }, [selectedBook, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Manual Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Manual Order</DialogTitle>
          <DialogDescription>
            Manually create a book order with custom details.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Book Selection */}
              <FormField
                control={form.control}
                name="book_id"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>
                      Book <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a book" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {books.map((book) => (
                          <SelectItem key={book.book_id} value={book.book_id}>
                            {book.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+8801234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Alternative Phone */}
              <FormField
                control={form.control}
                name="alternative_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternative Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+8801234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Product Price */}
              <FormField
                control={form.control}
                name="product_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Product Price <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Quantity */}
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Quantity <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 1)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paid_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paid Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Transaction ID */}
              <FormField
                control={form.control}
                name="Txn_ID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Transaction ID <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Book Order Status */}
              <FormField
                control={form.control}
                name="book_order_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Order Status <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Status */}
              <FormField
                control={form.control}
                name="payment_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Payment Status <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SUCCESS">Success</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="FAILED">Failed</SelectItem>
                        <SelectItem value="REFUNDED">Refunded</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Delivery Method */}
              <FormField
                control={form.control}
                name="delivery_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Delivery Method{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="inside_dhaka">
                          Inside Dhaka
                        </SelectItem>
                        <SelectItem value="outside_dhaka">
                          Outside Dhaka
                        </SelectItem>
                        <SelectItem value="sundarban">Sundarban</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Method */}
              <FormField
                control={form.control}
                name="payment_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Payment Method <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BKASH">BKASH</SelectItem>
                        <SelectItem value="NAGAD">NAGAD</SelectItem>
                        <SelectItem value="SSL_COMMERZ">SSL_COMMERZ</SelectItem>
                        <SelectItem value="CASH">CASH</SelectItem>
                        <SelectItem value="OTHER">OTHER</SelectItem>
                        <SelectItem value="BANK">BANK</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Address <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Full delivery address"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Order"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
