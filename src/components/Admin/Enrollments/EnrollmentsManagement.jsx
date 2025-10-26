import EnrollmentsTable, {
  EnrollmentsTableSkeleton,
} from "@/components/Admin/Enrollments/EnrollmentsTable";
import UserDashboardLayout from "@/components/shared/DashboardLayout";
import Loading from "@/components/shared/Loading";
import Pagination from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { default as api, downloadExcelFile } from "@/lib/api";
import { ChevronDown, Download, Eye, Search } from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useNavigate } from "react-router-dom";

const EnrollmentsManagement = forwardRef(function EnrollmentsManagement(
  { useLayout = true },
  ref
) {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [searchForm, setSearchForm] = useState({
    course_id: "",
    enrollment_type: "",
    start_date: "",
    end_date: "",
  });
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [courseSearch, setCourseSearch] = useState("");
  const [coursePopoverOpen, setCoursePopoverOpen] = useState(false);

  const fetchEnrollments = async (page = 1, searchParams = {}) => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("page_size", itemsPerPage.toString());

      // Add search parameters if provided
      if (searchParams.course_id && searchParams.course_id !== "all")
        params.append("course_id", searchParams.course_id);
      if (searchParams.enrollment_type)
        params.append(
          "enrollment_type",
          searchParams.enrollment_type === "both"
            ? ""
            : searchParams.enrollment_type
        );
      if (searchParams.start_date)
        params.append("start_date", searchParams.start_date);
      if (searchParams.end_date)
        params.append("end_date", searchParams.end_date);

      const response = await api.get(`/enrollments?${params.toString()}`);
      if (response.data.success) {
        const enrollmentsData = response.data?.enrollments || [];
        const totalCount = response.data?.totalCount || enrollmentsData.length;
        const coursesData = response.data?.courses || [];

        // Sort by created date (newest first)
        enrollmentsData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setEnrollments(enrollmentsData);
        setCourses(coursesData);
        setTotalPages(Math.ceil(totalCount / itemsPerPage));
      }
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchEnrollments,
  }));

  useEffect(() => {
    fetchEnrollments(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchEnrollments(currentPage);
  }, [currentPage]);

  const handleSearch = async () => {
    setSearching(true);
    try {
      await fetchEnrollments(1, searchForm);
      setCurrentPage(1); // Reset to first page when searching
      setHasSearched(true);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchChange = (field, value) => {
    setSearchForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDownloadExcel = async () => {
    setDownloading(true);
    try {
      const params = new URLSearchParams();
      if (searchForm.start_date)
        params.append("start_date", searchForm.start_date);
      if (searchForm.end_date) params.append("end_date", searchForm.end_date);

      const filename = `enrollments_${searchForm.start_date || "all"}_to_${
        searchForm.end_date || "all"
      }.xlsx`;

      await downloadExcelFile(
        `/enrollments-excel?${params.toString()}`,
        filename
      );
    } catch (error) {
      console.error("Error downloading Excel:", error);
      // You might want to show a toast error here
    } finally {
      setDownloading(false);
    }
  };

  const handleView = (enrollment) => {
    navigate(`/admin/enrollments/${enrollment.id}`, { state: { enrollment } });
  };

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + enrollments.length;
  const currentEnrollments = enrollments;

  const content = (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="bg-card rounded-lg border p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="sm:col-span-1">
            <Label htmlFor="search_course" className="text-sm font-medium">
              Course
            </Label>
            <Popover
              open={coursePopoverOpen}
              onOpenChange={setCoursePopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={coursePopoverOpen}
                  className="w-full justify-between mt-1"
                >
                  {searchForm.course_id
                    ? courses.find(
                        (course) => course.course_id === searchForm.course_id
                      )?.course_title +
                      " (" +
                      courses.find(
                        (course) => course.course_id === searchForm.course_id
                      )?.batch +
                      ")"
                    : "Select course..."}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <div className="p-2">
                  <Input
                    placeholder="Search courses..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className="mb-2"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  <div
                    className="px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                    onClick={() => {
                      handleSearchChange("course_id", "");
                      setCoursePopoverOpen(false);
                      setCourseSearch("");
                    }}
                  >
                    All Courses
                  </div>
                  {courses
                    .filter(
                      (course) =>
                        course.course_title
                          .toLowerCase()
                          .includes(courseSearch.toLowerCase()) ||
                        course.batch
                          .toLowerCase()
                          .includes(courseSearch.toLowerCase())
                    )
                    .map((course) => (
                      <div
                        key={course.course_id}
                        className="px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                        onClick={() => {
                          handleSearchChange("course_id", course.course_id);
                          setCoursePopoverOpen(false);
                          setCourseSearch("");
                        }}
                      >
                        {course.course_title} ({course.batch})
                      </div>
                    ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="sm:col-span-1">
            <Label
              htmlFor="search_enrollment_type"
              className="text-sm font-medium"
            >
              Enrollment Type
            </Label>
            <Select
              value={searchForm.enrollment_type}
              onValueChange={(value) =>
                handleSearchChange("enrollment_type", value)
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-1 lg:col-span-1">
            <Label htmlFor="search_start_date" className="text-sm font-medium">
              Start Date
            </Label>
            <Input
              id="search_start_date"
              type="date"
              value={searchForm.start_date}
              onChange={(e) => handleSearchChange("start_date", e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="sm:col-span-1 lg:col-span-1">
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
          <div className="sm:col-span-2 lg:col-span-1">
            <Button
              onClick={handleSearch}
              disabled={searching}
              className="flex items-center gap-2 w-full"
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
      {loading ? (
        <EnrollmentsTableSkeleton />
      ) : enrollments.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-lg border-2 border-dashed border-border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No enrollments yet</h3>
          <p className="text-muted-foreground mb-4">
            Enrollments will appear here once students start enrolling in
            courses.
          </p>
        </div>
      ) : (
        <>
          {hasSearched &&
            enrollments.length > 0 &&
            (searchForm.start_date || searchForm.end_date) && (
              <div className="flex justify-end mb-4">
                <Button
                  onClick={handleDownloadExcel}
                  disabled={downloading}
                  variant="success"
                  className="flex items-center gap-2"
                >
                  {downloading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Preparing download...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download Excel
                    </>
                  )}
                </Button>
              </div>
            )}

          <EnrollmentsTable
            enrollments={currentEnrollments}
            startIndex={startIndex}
            onView={handleView}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={enrollments.length}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={setCurrentPage}
          />
        </>
      )}
      {downloading && <Loading text="Preparing download" />}
    </div>
  );

  return useLayout ? (
    <UserDashboardLayout>{content}</UserDashboardLayout>
  ) : (
    content
  );
});

export default EnrollmentsManagement;
