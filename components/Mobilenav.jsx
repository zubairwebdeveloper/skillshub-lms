"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, ChevronDown } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import UserDropdown from "@/components/UserDropdown";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

function getInitials(name = "") {
  if (!name) return "U";
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function MobileNav({ navLinks, user, mounted }) {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 lg:hidden">
      {/* Signed in: quick access dropdown stays in the topbar */}
      {!mounted ? (
        <div className="h-9 w-9 animate-pulse rounded-full bg-slate-100" />
      ) : user ? (
        <UserDropdown />
      ) : null}

      {/* Hamburger -> slide-in drawer with nav links as an accordion */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-slate-100 active:scale-95"
          >
            <Menu
              className={`absolute h-6 w-6 transition-all duration-200 ${
                open ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
              }`}
            />
            <X
              className={`absolute h-6 w-6 transition-all duration-200 ${
                open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
              }`}
            />
          </button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="flex w-[300px] flex-col p-0 sm:w-[360px]"
        >
          <SheetHeader className="border-b px-5 py-4">
            <SheetTitle className="text-left text-base font-semibold">
              Skills Hub
            </SheetTitle>
            <SheetDescription className="sr-only">
              Site navigation menu
            </SheetDescription>
          </SheetHeader>

          <nav className="flex-1 overflow-y-auto px-2 py-2">
            {navLinks.map((item) =>
              item.children ? (
                <Collapsible key={item.name}>
                  <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-slate-100 hover:text-blue-600">
                    {item.name}
                    <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="overflow-hidden pb-1 pl-3 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <div className="ml-2 flex flex-col gap-0.5 border-l border-slate-200 pl-3">
                      {item.children.map((child) => {
                        const isActive = pathname === child.href;
                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className={`rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-100 hover:text-blue-600 ${
                              isActive
                                ? "font-medium text-blue-600"
                                : "text-slate-600"
                            }`}
                          >
                            {child.name}
                          </Link>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-slate-100 hover:text-blue-600 ${
                    pathname === item.href ? "text-blue-600" : ""
                  }`}
                >
                  {item.name}
                </Link>
              ),
            )}
          </nav>

          {/* Auth area, pinned to the bottom of the drawer */}
          <div
            className="border-t px-5 py-4"
            style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
          >
            {!mounted ? (
              <div className="h-11 w-full animate-pulse rounded-lg bg-slate-100" />
            ) : user ? (
              <div className="flex items-center gap-3 rounded-lg border px-3 py-2.5">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user.photoURL ?? ""}
                    alt={user.displayName ?? "User"}
                  />
                  <AvatarFallback className="bg-blue-600 text-xs text-white">
                    {getInitials(user.displayName)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {user.displayName || "User"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>

                <button
                  onClick={async () => {
                    await logout();
                    setOpen(false);
                  }}
                  aria-label="Logout"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/login">Login</Link>
                </Button>

                <Button
                  asChild
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
