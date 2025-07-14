"use client"
import "../src/datadog";
import Community from "@/components/Community";
import Hero from "@/components/Hero";
import Service from "@/components/Service";
import Subscription from "@/components/Subscription";
import HomeLayout from "@/layouts/homeLayout/HomeLayout";

export default function Home() {
  return (
    <>
      <HomeLayout>
        <Hero />
        <Community />
        <Service />
        <Subscription />
      </HomeLayout>
    </>
  );
}
