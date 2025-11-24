import Header1 from "../component/Header1";
import Sidebar from "../component/Sidebar";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
        <Header1/>
        <div className="flex">
            <Sidebar/>
            
            {children}
           
        </div>
    </div>
  );
}
