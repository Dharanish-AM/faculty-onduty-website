import { useState, useMemo, useEffect } from "react";
import { z } from "zod";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Search,
  FileSpreadsheet,
  Users,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import axios from "axios";

interface ODSubmission {
  _id: string;
  name: string;
  email: string;
  eventType: string;
  eventTitle: string;
  eventDescription: string;
  venue: string;
  fromDate: string;
  toDate: string;
  submittedOn: string;
}

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [submissions, setSubmissions] = useState<ODSubmission[]>([]);

  // Fetch from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/submissions`
        );
        setSubmissions(res.data.data || []);
      } catch (err) {
        console.error("❌ Failed to load data", err);
        toast.error("Failed to fetch submissions");
      }
    };
    fetchData();
  }, []);

  // Filter submissions
  const filteredSubmissions = useMemo(() => {
    if (!searchQuery.trim()) return submissions;
    const query = searchQuery.toLowerCase();
    return submissions.filter(
      (sub) =>
        sub.name.toLowerCase().includes(query) ||
        sub.email.toLowerCase().includes(query) ||
        sub.eventType.toLowerCase().includes(query) ||
        sub.eventTitle.toLowerCase().includes(query) ||
        sub.venue.toLowerCase().includes(query)
    );
  }, [submissions, searchQuery]);

  // Analytics
  const analytics = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthCount = submissions.filter((sub) => {
      const date = new Date(sub.submittedOn);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    }).length;

    const venues = new Set(submissions.map((sub) => sub.venue));

    return {
      total: submissions.length,
      thisMonth: thisMonthCount,
      venues: venues.size,
    };
  }, [submissions]);

  // Export to Excel
  const handleExport = () => {
    if (filteredSubmissions.length === 0) {
      toast.error("No data to export");
      return;
    }

    // Prepare worksheet data
    const data = filteredSubmissions.map((sub) => ({
      Name: sub.name,
      Email: sub.email,
      "Event Type": sub.eventType,
      "Event Title": sub.eventTitle,
      "Event Description": sub.eventDescription,
      Venue: sub.venue,
      "From Date": new Date(sub.fromDate).toLocaleDateString(),
      "To Date": new Date(sub.toDate).toLocaleDateString(),
      "Submitted On": new Date(sub.submittedOn).toLocaleString(),
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OD Submissions");

    // 💅 Formatting
    const range = XLSX.utils.decode_range(worksheet["!ref"]!);

    // Bold header row & adjust alignment
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F81BD" } }, // blue background
        alignment: { horizontal: "center", vertical: "center" },
      };
    }

    // Column width auto-adjust
    const colWidths = Object.keys(data[0]).map((key) => ({
      wch: Math.max(key.length + 5, 20),
    }));
    worksheet["!cols"] = colWidths;

    // Borders and cell alignment
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = {
          ...worksheet[cellAddress].s,
          alignment: { vertical: "center", wrapText: true },
          border: {
            top: { style: "thin", color: { rgb: "CCCCCC" } },
            bottom: { style: "thin", color: { rgb: "CCCCCC" } },
            left: { style: "thin", color: { rgb: "CCCCCC" } },
            right: { style: "thin", color: { rgb: "CCCCCC" } },
          },
        };
      }
    }

    // Save file
    const fileName = `OD_Submissions_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;

    XLSX.writeFile(workbook, fileName, { bookType: "xlsx", compression: true });
    toast.success("✨ Excel exported with beautiful formatting!");
  };

  // Handle delete
  const handleDelete = async (submission) => {
    const confirmDelete = confirm(
      `Are you sure you want to delete "${submission.eventTitle}"?`
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/delete-submission/${
          submission._id
        }`
      );
      toast.success("Submission deleted successfully!");
      setSubmissions((prev) => prev.filter((s) => s._id !== submission._id));
    } catch (error) {
      console.error("❌ Delete failed:", error);
      toast.error("Failed to delete submission.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Faculty OD Submissions Overview
              </p>
            </div>
            <div className="ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("adminToken");
                  localStorage.removeItem("adminEmail");
                  window.location.href = "/admin-auth";
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Analytics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">
                Total Requests
              </CardTitle>
              <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {analytics.total}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All-time submissions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {analytics.thisMonth}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Current month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">Venues</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {analytics.venues}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Distinct venues
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-sm font-medium">
                Filtered Results
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {filteredSubmissions.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Visible entries
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Export */}
        <div className="bg-card p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, venue, event type..."
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
                  <TableHead className="text-primary-foreground font-semibold">
                    Name
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold">
                    Email
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold">
                    Event Type
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold">
                    Event Title
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold">
                    Venue
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold">
                    From
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold">
                    To
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold">
                    Submitted
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {submissions.length === 0
                        ? "No submissions yet."
                        : "No results found. Try another search."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions.map((sub, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{sub.name}</TableCell>
                      <TableCell>{sub.email}</TableCell>
                      <TableCell>{sub.eventType}</TableCell>
                      <TableCell>{sub.eventTitle}</TableCell>
                      <TableCell>{sub.venue}</TableCell>
                      <TableCell>
                        {new Date(sub.fromDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(sub.toDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(sub.submittedOn).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(sub)}
                          >
                            Delete
                          </Button>
                        </div>
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
