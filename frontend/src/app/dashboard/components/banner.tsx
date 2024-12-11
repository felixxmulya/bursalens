import Link from "next/link";

export default function Banner() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-cover bg-center text-white" style={{ backgroundImage: "url('/images/banner.jpg')" }}>
            <h1 className="text-6xl font-bold mb-4">Predict Stock Prices</h1>
            <p className="text-xl mb-6">Get accurate stock predictions using advanced machine learning algorithms.</p>
            <Link className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 transition-colors rounded" href="/prediction">
                Predict Now
            </Link>
        </div>
    );
}