import AdminLayout from "@/components/shared/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/api";
import { formatPrice } from "@/lib/helper";
import {
  AlertCircle,
  Banknote,
  BarChart3,
  BookOpen,
  DollarSign,
  Eye,
  GraduationCap,
  Search,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AdminDashboardPage() {
  const [financeData, setFinanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchForm, setSearchForm] = useState({
    start_date: "",
    end_date: "",
  });
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchFinanceData = async (params = {}) => {
      setLoading(true);
      try {
        // Build query parameters
        const queryParams = new URLSearchParams();
        if (params.start_date)
          queryParams.append("start_date", params.start_date);
        if (params.end_date) queryParams.append("end_date", params.end_date);

        const response = await api.get(`/finance?${queryParams.toString()}`);
        if (response.data.success) {
          setFinanceData(response.data);
        } else {
          toast.error(response.data.message || "Failed to load finance data");
        }
      } catch (error) {
        console.error("Finance data fetch error:", error);
        toast.error("Failed to load finance data");
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, []);

  const metrics = [
    {
      title: "Total Book Sales",
      value: financeData
        ? formatPrice(financeData.total_book_sell_amount)
        : "0",
      icon: BookOpen,
      description: "Revenue from book sales",
    },
    {
      title: "Total Course Sales",
      value: financeData
        ? formatPrice(financeData.total_course_sell_amount)
        : "0",
      icon: GraduationCap,
      description: "Revenue from course sales",
    },
    {
      title: "Total Sales",
      value: financeData ? formatPrice(financeData.total_sell) : "0",
      icon: DollarSign,
      description: "Combined revenue from books and courses",
    },
    {
      title: "Total Paid",
      value: financeData ? formatPrice(financeData.totalPaid) : "0",
      icon: Banknote,
      description: "Total amount paid",
    },
    {
      title: "Total Withdrawable Amount",
      value: financeData ? formatPrice(financeData.withrawable) : "0",
      icon: Banknote,
      description: "Total amount available for withdrawal from Payment Gateway",
    },
    {
      title: "Total Due",
      value: financeData ? formatPrice(financeData.totalDue) : "0",
      icon: AlertCircle,
      description: "Total amount due",
    },

    {
      title: "Pending Book Orders",
      value: financeData ? financeData.pending_book_orders : 0,
      icon: AlertCircle,
      description: "Orders awaiting fulfillment",
    },
    {
      title: "Inactive Course Orders",
      value: financeData ? financeData.inactive_course_orders : 0,
      icon: Users,
      description: "Inactive course enrollments",
    },

    {
      title: "Total Book Orders",
      value: financeData
        ? financeData.book_sales?.reduce(
            (acc, item) => acc + item.total_orders,
            0
          )
        : 0,
      icon: BookOpen,
      description: "Total number of book orders",
    },
    {
      title: "Total Course Orders",
      value: financeData
        ? financeData.course_sales?.reduce(
            (acc, item) => acc + item.total_orders,
            0
          )
        : 0,
      icon: GraduationCap,
      description: "Total number of course orders",
    },
    {
      title: "Number of Unique Book Sales",
      value: financeData
        ? financeData.book_sales?.filter((item) => item.total_orders > 0).length
        : 0,
      icon: BookOpen,
      description: "Number of unique book sales",
    },

    {
      title: "Number of Unique Course Sales",
      value: financeData
        ? financeData.course_sales?.filter((item) => item.total_orders > 0)
            .length
        : 0,
      icon: GraduationCap,
      description: "Number of unique course sales",
    },
  ];

  const handleSearch = async () => {
    setSearching(true);
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (searchForm.start_date.trim())
        params.append("start_date", searchForm.start_date.trim());
      if (searchForm.end_date.trim())
        params.append("end_date", searchForm.end_date.trim());

      const response = await api.get(`/finance?${params.toString()}`);
      if (response.data.success) {
        setFinanceData(response.data);
        toast.success(
          response.data.message || "Finance data loaded successfully"
        );
      } else {
        toast.error(response.data.message || "Failed to load finance data");
      }
    } catch (error) {
      console.error("Finance data fetch error:", error);
      toast.error("Failed to load finance data");
    } finally {
      setSearching(false);
      setLoading(false);
    }
  };

  const handleSearchChange = (field, value) => {
    setSearchForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Helper function to process sales data
  const processSalesData = (bookSales, courseSales, timeKey) => {
    const groupedData = {};

    // Process book sales
    bookSales?.forEach((item) => {
      const key =
        item[timeKey]?.split("-").length == 3
          ? item[timeKey]?.split("-")[2]
          : item[timeKey];

      if (!groupedData[key]) {
        groupedData[key] = { books: 0, courses: 0 };
      }
      groupedData[key].books += item.total;
    });

    // Process course sales
    courseSales?.forEach((item) => {
      const key =
        item[timeKey]?.split("-").length == 3
          ? item[timeKey]?.split("-")[2]
          : item[timeKey];
      if (!groupedData[key]) {
        groupedData[key] = { books: 0, courses: 0 };
      }
      groupedData[key].courses += item.total;
    });

    // Convert to array format for charts
    return Object.keys(groupedData)
      .sort()
      .map((key) => ({
        [timeKey]: key,
        books: groupedData[key].books,
        courses: groupedData[key].courses,
      }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h2>
        </div>

        {/* Search Form */}
        <div className="bg-card rounded-lg border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end justify-center">
            <div className="flex-1 mx-auto w-full">
              <Label
                htmlFor="search_start_date"
                className="text-sm font-medium"
              >
                Start Date
              </Label>
              <Input
                id="search_start_date"
                type="date"
                value={searchForm.start_date}
                onChange={(e) =>
                  handleSearchChange("start_date", e.target.value)
                }
                className="mt-1"
              />
            </div>
            <div className="flex-1 mx-auto w-full">
              <Label htmlFor="search_end_date" className="text-sm font-medium">
                End Date
              </Label>
              <Input
                id="search_end_date"
                type="date"
                value={searchForm.end_date}
                onChange={(e) => handleSearchChange("end_date", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Button
                onClick={handleSearch}
                disabled={searching}
                className="flex items-center gap-2"
              >
                {searching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? // Skeleton loaders for metrics
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </CardContent>
                </Card>
              ))
            : // Actual metrics
              metrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {metric.title}
                    </CardTitle>
                    <metric.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {metric.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Sales Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Book Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Book Sales Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  // Skeleton loaders for book sales
                  Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))
                ) : (
                  // Actual book sales data
                  <>
                    {financeData?.book_sales?.slice(0, 5).map((book) => (
                      <div
                        key={book.book_id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">
                            {book.book_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {book.total_orders} orders
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatPrice(book.total_amount)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View All Books
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Book Sales Details</DialogTitle>
                        </DialogHeader>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Book Name</TableHead>
                              <TableHead>Total Orders</TableHead>
                              <TableHead>Total Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {financeData?.book_sales?.map((book) => (
                              <TableRow key={book.book_id}>
                                <TableCell className="font-medium">
                                  {book.book_name}
                                </TableCell>
                                <TableCell>{book.total_orders}</TableCell>
                                <TableCell>
                                  {formatPrice(book.total_amount)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Course Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Course Sales Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  // Skeleton loaders for course sales
                  Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))
                ) : (
                  // Actual course sales data
                  <>
                    {financeData?.course_sales?.slice(0, 5).map((course) => (
                      <div
                        key={course.course_id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">
                            {course.course_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {course.total_orders} orders
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatPrice(course.total_amount)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View All Courses
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Course Sales Details</DialogTitle>
                        </DialogHeader>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Course Name</TableHead>
                              <TableHead>Total Orders</TableHead>
                              <TableHead>Total Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {financeData?.course_sales?.map((course) => (
                              <TableRow key={course.course_id}>
                                <TableCell className="font-medium">
                                  {course.course_name}
                                </TableCell>
                                <TableCell>{course.total_orders}</TableCell>
                                <TableCell>
                                  {formatPrice(course.total_amount)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Trends */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-foreground">Sales Trends</h3>

          {/* Daily Sales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Daily Sales Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={processSalesData(
                    financeData?.daily_book_sales,
                    financeData?.daily_course_sales,
                    "day"
                  )}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="books"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Book Sales"
                  />
                  <Line
                    type="monotone"
                    dataKey="courses"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    name="Course Sales"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weekly Sales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Weekly Sales Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={processSalesData(
                    financeData?.weekly_book_sales,
                    financeData?.weekly_course_sales,
                    "week"
                  )}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="books"
                    stroke="#ffc658"
                    strokeWidth={2}
                    name="Book Sales"
                  />
                  <Line
                    type="monotone"
                    dataKey="courses"
                    stroke="#ff7300"
                    strokeWidth={2}
                    name="Course Sales"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Sales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Monthly Sales Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={processSalesData(
                    financeData?.monthly_book_sales,
                    financeData?.monthly_course_sales,
                    "month"
                  )}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="books"
                    stroke="#8dd1e1"
                    strokeWidth={2}
                    name="Book Sales"
                  />
                  <Line
                    type="monotone"
                    dataKey="courses"
                    stroke="#d084d0"
                    strokeWidth={2}
                    name="Course Sales"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
