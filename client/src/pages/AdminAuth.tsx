

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const AdminAuth = () => {
  const [isSignup, setIsSignup] = useState(false);

  const form = useForm({
    resolver: zodResolver(isSignup ? signupSchema : loginSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: any) => {
    try {
      const endpoint = isSignup
        ? `${import.meta.env.VITE_API_URL}/api/admin/signup`
        : `${import.meta.env.VITE_API_URL}/api/admin/login`;

      const response = await axios.post(endpoint, values);

      if (response.data.success) {
        toast.success(isSignup ? "Signup successful!" : "Login successful!");
        if (!isSignup) {
          localStorage.setItem("adminToken", response.data.token);
          localStorage.setItem("adminEmail", values.email);
          window.location.href = "/admin-dashboard";
        } else {
          setIsSignup(false);
          form.reset();
        }
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.response?.data?.message || "Request failed");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-6 shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center mb-4">
            {isSignup ? "Admin Signup" : "Admin Login"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {isSignup && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@sece.ac.in" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {isSignup ? "Create Account" : "Login"}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <button
                  className="text-primary hover:underline"
                  onClick={() => setIsSignup(false)}
                >
                  Login here
                </button>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <button
                  className="text-primary hover:underline"
                  onClick={() => setIsSignup(true)}
                >
                  Signup here
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;