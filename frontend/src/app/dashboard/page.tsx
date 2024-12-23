"use client";
import About from "./components/about";
import Banner from "./components/banner";
import Feature from "./components/feature";
import Hero from "./components/hero";
import NewsDashboard from "./components/news";

export default function dashboard() {
    return (
        <div>
            <Hero/>
            <About/>
            <Feature/>
            <Banner/>
            <NewsDashboard/>
        </div>
    );
}

