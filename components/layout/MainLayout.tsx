import AppShell from "./AppShell";

import { getSessionUser } from "@/lib/auth";

interface Props {
  children: React.ReactNode;
}

export default async function MainLayout({ children }: Props) {

  const user = await getSessionUser();

  return (
    <AppShell user={user}>
      {children}
    </AppShell>
  );
}
