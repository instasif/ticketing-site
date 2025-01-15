import SellerDashboard from "@/components/Compo/SellerDashboard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SellerPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");


  return <div className=" min-h-screen bg-green-50">
    <SellerDashboard />
  </div>;
}
