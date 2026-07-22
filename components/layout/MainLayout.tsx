import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

import { getSessionUser } from "@/lib/auth";

interface Props {
  children: React.ReactNode;
}

export default async function MainLayout({ children }: Props) {

  const user = await getSessionUser();

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar user={user} />

      <div className="flex flex-1 flex-col">
        <Header user={user} />

        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
