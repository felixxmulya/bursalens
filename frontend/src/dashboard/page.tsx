import Banner from "./components/banner";
import Feature from "./components/feature";
import Hero from "./components/hero";
import NewsDashboard from "./components/news";

export default function dashboard() {
    return (
        <div>
            <Hero/>
            <Feature/>
            <Banner/>
            <NewsDashboard/>
        </div>
    );
}

