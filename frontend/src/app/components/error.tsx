import Image from "next/image";

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
        <Image
            src="/images/not-found.png"
            alt="Error"
            width={300}
            height={300}
        />
        <div className="text-center">
                <p className="text-3xl font-bold text-gray-800 mb-4">Oops! Something went wrong</p>
                <p className="text-lg text-gray-600">Please try again later</p>
        </div>
    </div>
  );
}