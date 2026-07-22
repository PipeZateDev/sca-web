import { LucideIcon } from "lucide-react";

import { Role } from "@/types/user";

export interface MenuChildItem {
  title: string;
  href: string;
  roles?: Role[];
}

export interface MenuItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  roles?: Role[];
  children?: MenuChildItem[];
}
