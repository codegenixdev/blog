import { AdminLayout } from "@/app/[lang]/(admin)/_components/admin-layout";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};
const Layout = ({ children }: LayoutProps) => {
  return <AdminLayout slotProps={{ userAvatar: null }}>{children}</AdminLayout>;
};

export default Layout;
