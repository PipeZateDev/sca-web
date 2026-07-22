import { LucideIcon } from "lucide-react";

import { Role } from "@/types/user";

export interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: Role[];
}
