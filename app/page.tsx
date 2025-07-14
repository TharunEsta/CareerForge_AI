import React from "react";
import { Sidebar, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";

export default function HomePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-64">
        <SidebarHeader>
          <span className="font-bold text-lg">CareerForge</span>
        </SidebarHeader>
        <div className="flex-1 p-4">Welcome to CareerForge!</div>
        <SidebarFooter>
          <span className="text-xs text-gray-500">&copy; {new Date().getFullYear()} CareerForge</span>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>This is your main dashboard. Use the sidebar to navigate.</p>
      </main>
    </div>
  );
} 
