"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Dashboard from "@/dashboard/page";

export default function Home() {
  return (
    <div>
      <Header/>
      <Dashboard/>
      <Footer/>
    </div>
  );
}