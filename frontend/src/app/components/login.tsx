import Image from "next/image";
import { SignInButton } from "@clerk/nextjs";

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
        <Image
            src="/images/login.png"
            alt="Error"
            width={500}
            height={500}
        />
        <div className="text-center space-y-4">
            <h1 className="text-2xl">Please sign in to access this page.</h1>

            <div className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-transform text-center">
                <button>
                    <SignInButton />
                </button>
            </div>
        </div>
    </div>
  );
}