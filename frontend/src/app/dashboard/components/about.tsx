import Image from "next/image";

export default function About() {
    return (
        <div id="about" className="h-screen bg-white flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                Our Story
            </h2>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="space-y-6 order-2 md:order-1">
                    <div className="prose lg:prose-lg text-gray-600">
                        <p className="mb-6 text-lg leading-relaxed">
                            Founded in 2024, Stock Prediction was born from a vision to democratize access to advanced financial analytics. We recognized that while the Indonesian market was growing rapidly, many investors lacked access to sophisticated prediction tools.
                        </p>
                        <p className="mb-6 text-lg leading-relaxed">
                            Our team of financial experts and data scientists came together to build a platform that combines cutting-edge AI technology with deep market understanding, making professional-grade analysis accessible to everyone.
                        </p>
                        <p className="text-lg leading-relaxed">
                            Today, we&apos;re proud to serve thousands of investors, from beginners to professionals, helping them make more informed investment decisions in the Indonesian stock market.
                        </p>
                    </div>
                </div>

                <div className="relative h-[400px] order-1 md:order-2">
                    <Image
                        src="/images/about.jpg"
                        alt="Our Story"
                        fill
                        className="object-cover rounded-2xl shadow-xl"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}