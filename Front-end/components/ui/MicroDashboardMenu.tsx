'use client';
import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "./dropdown-menu";
import { useAuth } from "@/components/AuthContext";

export default function MicroDashboardMenu() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="fixed top-4 right-4 z-40">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="focus:outline-none">
            <Avatar>
              <AvatarImage src={user.avatarUrl || "/placeholder-user.jpg"} alt={user.name} />
              <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 shadow-xl rounded-xl p-2 bg-white dark:bg-gray-900">
          <DropdownMenuLabel className="flex flex-col gap-1">
            <span className="font-semibold text-base text-gray-900 dark:text-white">{user.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">{user.subscription?.plan?.toUpperCase() || "FREE"} PLAN</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href="/profile" className="w-full block text-sm">Profile</a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/dashboard" className="w-full block text-sm">Dashboard</a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400 font-semibold cursor-pointer">
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 