"use client";

import Link from "next/link";
import { User, LayoutDashboard, LogOut } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

function getInitials(name = "") {
  if (!name) return "U";

  return name
    .split(" ")
    .map((item) => item[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function UserDropdown() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-slate-100 transition">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={user.photoURL ?? ""}
              alt={user.displayName ?? "User"}
            />

            <AvatarFallback className="bg-blue-600 text-white">
              {getInitials(user.displayName)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          <p className="font-semibold text-blue-700 text-lg py-2">
            {user.displayName || "User"}
          </p>

          <p className="truncate text-md py-1 text-muted-foreground">
            {user.email}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            My Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Logout?</AlertDialogTitle>

              <AlertDialogDescription>
                Are you sure you want to log out? You&apos;ll need to sign in again
                to access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <AlertDialogAction
                onClick={logout}
                className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 px-3 py-2 rounded-md">
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
