import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Search, FileSpreadsheet, Users, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import * as XLSX from "xlsx";

interface ODSubmission {
  fullName: string;
  rollNo: string;
  email: string;
  department: string;
  eventType: string;
  eventTitle: string;
  eventDescription: string;
  fromDate: string;
  toDate: string;
  submittedOn: string;
}

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get submissions from localStorage
  const submissions: ODSubmission[] = useMemo(() => {
    const stored = localStorage.getItem("odSubmissions");
    return stored ? JSON.parse(stored) : [];
  }, []);

  // Filter submissions based on search
  const filteredSubmissions = useMemo(() => {
    if (!searchQuery.trim()) return submissions;
    
    const query = searchQuery.toLowerCase();
    return submissions.filter(
      (sub) =>
        sub.fullName.toLowerCase().includes(query) ||
        sub.rollNo.toLowerCase().includes(query) ||
        sub.department.toLowerCase().includes(query) ||
        sub.eventType.toLowerCase().includes(query) ||
        sub.eventTitle.toLowerCase().includes(query)
    );
  }, [submissions, searchQuery]);

  // Calculate analytics
  const analytics = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonthCount = submissions.filter((sub) => {
      const subDate = new Date(sub.submittedOn);
      return subDate.getMonth() === currentMonth && subDate.getFullYear() === currentYear;
    }).length;
    
    const departments = new Set(submissions.map((sub) => sub.department));
    
    return {
      total: submissions.length,
      thisMonth: thisMonthCount,
      departments: departments.size,
    };
  }, [submissions]);

  // Export to Excel
  const handleExport = () => {
    if (filteredSubmissions.length === 0) {
      toast.error("No data to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      filteredSubmissions.map((sub) => ({
        "Full Name": sub.fullName,
        "Roll No": sub.rollNo,
        "Email": sub.email,
        "Department": sub.department,
        "Event Type": sub.eventType,
        "Event Title": sub.eventTitle,
        "Event Description": sub.eventDescription,
        "From Date": sub.fromDate,
        "To Date": sub.toDate,
        "Submitted On": new Date(sub.submittedOn).toLocaleString(),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OD Submissions");
    
    const fileName = `OD_Submissions_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    toast.success("Data exported successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <Link to="/">
                <Button variant="ghost" size="sm" className="mb-2">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">OD Submissions Management</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{analytics.total}</div>
              <p className="text-xs text-muted-foreground mt-1">All time submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{analytics.thisMonth}</div>
              <p className="text-xs text-muted-foreground mt-1">Current month requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{analytics.departments}</div>
              <p className="text-xs text-muted-foreground mt-1">Distinct departments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Filtered Results</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{filteredSubmissions.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Current view count</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Export Section */}
        <div className="bg-card p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, roll no, department, event..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={handleExport} className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary">
                  <TableHead className="text-primary-foreground font-semibold">Name</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Roll No</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Department</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Event Type</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Event Title</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">From</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">To</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {submissions.length === 0
                        ? "No submissions yet. Faculty can submit OD requests from the faculty form page."
                        : "No results found. Try a different search query."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions.map((submission, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{submission.fullName}</TableCell>
                      <TableCell>{submission.rollNo}</TableCell>
                      <TableCell>{submission.department}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">
                          {submission.eventType}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={submission.eventTitle}>
                        {submission.eventTitle}
                      </TableCell>
                      <TableCell>{submission.fromDate}</TableCell>
                      <TableCell>{submission.toDate}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(submission.submittedOn).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
