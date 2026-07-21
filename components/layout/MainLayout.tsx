import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

interface Props {
  children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}