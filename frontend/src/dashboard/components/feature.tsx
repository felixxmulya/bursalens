import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faNewspaper, faBell } from "@fortawesome/free-solid-svg-icons";

export default function Feature() {
    const features = [
        {
            title: "AI Predictions",
            description: "Get accurate stock predictions using advanced machine learning algorithms",
            icon: faRobot,
        },
        {
            title: "Market News",
            description: "Stay updated with real-time news from trusted Indonesian financial sources",
            icon: faNewspaper,
        },
        {
            title: "Smart Notifications",
            description: "Receive notifications for important market movements and news",
            icon: faBell,
        },
    ];

    return (
        <div className="flex flex-col items-center justify-center h-screen md:px-32 bg-white">
            <h1 className="text-3xl font-bold mb-8">Main Features</h1>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3 ">
                {features.map((feature, index) => (
                    <div key={index} className="flex flex-col items-center text-center p-12">
                        <div className="text-6xl text-blue-800 mb-4"><FontAwesomeIcon icon={feature.icon}/></div>
                        <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
                        <p className="text-gray-600">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}