import UserDashboardLayout from "@/components/UserDashboard/Layout";

export default function Dashboard() {
  return (
    <UserDashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="md:col-span-2 lg:col-span-3">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Dashboard Overview</h2>
            <p className="text-muted-foreground">
              Welcome to your learning dashboard. Here you can access your courses, notes, and books.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">My Courses</h3>
            <p className="text-sm text-muted-foreground">
              Access your enrolled courses and track progress.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Study Notes</h3>
            <p className="text-sm text-muted-foreground">
              Review and manage your study materials.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Books</h3>
            <p className="text-sm text-muted-foreground">
              Browse and purchase educational books.
            </p>
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
}
