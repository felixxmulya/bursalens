import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
    const imageLoader = ({ src, width }) => {
        return `${src}&w=${width}`;
    };

    return (
        <section className="flex flex-col-reverse md:flex-row md:h-screen md:items-center md:justify-around px-12 py-12 md:px-32 bg-gray-50">
            <div className="max-w-2xl mt-8 md:mt-0">
                <h2 className="text-sm text-blue-600 font-semibold mb-2">Smart Investation</h2>
                <h1 className="text-4xl font-bold mb-4">
                    Start to read the stock news <br />
                    and <span className="text-blue-600">Get Amazing Profit</span>
                </h1>
                <p className="text-gray-700 mb-6">
                    Maximize your investment in the capital market world with the convenience and various features provided by Stock.
                </p>
                <div className="flex flex-col md:flex-row md:space-x-4 text-center">
                    <Link href="/news" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 mb-3 md:mb-0">
                        Read News
                    </Link>
                    <Link href="/prediction" className="px-6 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white">
                        Try Stock Prediction <span className="text-sm text-red-500">Beta</span>
                    </Link>
                </div>
            </div>

            <div className="">
                <div className="relative">
                <Image
                    loader={imageLoader}
                    src="https://blush.design/api/download?shareUri=4rBL0Rp4O712o77x&c=Skin_0%7Eb75858-0.1%7Eff8282&w=800&h=800&fm=png"
                    alt="Hero Image"
                    priority
                    width={500}
                    height={500}
                    quality={75}
                    className="w-full h-auto"
                />
                </div>
            </div>
        </section>
    );
}