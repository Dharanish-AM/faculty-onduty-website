import { Link } from "react-router-dom";
import { FileText, LayoutDashboard, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Faculty OD System</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Faculty On-Duty Management
          </h2>
          <p className="text-lg text-muted-foreground">
            Streamlined system for submitting and managing faculty on-duty requests
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Faculty Form Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-6 w-6 text-primary" />
                <CardTitle>Faculty Form</CardTitle>
              </div>
              <CardDescription>
                Submit your on-duty request quickly and easily. Fill out the form with your event details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/faculty-form">
                <Button className="w-full" size="lg">
                  Submit OD Request
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Admin Dashboard Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <LayoutDashboard className="h-6 w-6 text-primary" />
                <CardTitle>Admin Dashboard</CardTitle>
              </div>
              <CardDescription>
                View all submitted OD requests, search, filter, and export data to Excel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin-dashboard">
                <Button className="w-full" variant="secondary" size="lg">
                  View Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold text-center mb-8 text-foreground">
            Key Features
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-accent-foreground" />
              </div>
              <h4 className="font-semibold mb-2 text-foreground">Easy Submission</h4>
              <p className="text-sm text-muted-foreground">
                Quick and simple form for faculty to submit OD requests
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <LayoutDashboard className="h-6 w-6 text-accent-foreground" />
              </div>
              <h4 className="font-semibold mb-2 text-foreground">Centralized Dashboard</h4>
              <p className="text-sm text-muted-foreground">
                View and manage all submissions in one place
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-6 w-6 text-accent-foreground" />
              </div>
              <h4 className="font-semibold mb-2 text-foreground">Excel Export</h4>
              <p className="text-sm text-muted-foreground">
                Download all data for record-keeping and analysis
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Faculty OD Management System © 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
