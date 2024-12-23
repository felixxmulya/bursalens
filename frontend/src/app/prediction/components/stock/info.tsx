import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons';

interface InfoProps {
    data: {
        name: string;
        currentPrice: number;
        fundamentals: {
            marketCap: number;
            PE: number | null;
            ROA: number | null;
            dividendYield: number | null;
        };
        modelMetrics: Array<{
            label: string;
            value: string;
            description: string;
        }>;
    };
    keyMetrics: Array<{
        label: string;
        value: string;
        icon: any;
        color: string;
    }>;
    modelMetrics: Array<{
        label: string;
        value: string;
        description: string;
    }>;
}

export default function Info({ data, keyMetrics, modelMetrics }: InfoProps) {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    {data.name}
                </h1>
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faMoneyBill} className="text-green-500" />
                    <span className="text-2xl font-semibold">
                        Rp {data.currentPrice.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {keyMetrics.map((metric, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{metric.label}</p>
                                <p className="text-xl font-bold">{metric.value}</p>
                            </div>
                            <FontAwesomeIcon icon={metric.icon} className={`${metric.color} text-xl`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Model Metrics */}
            <div className="my-6">
                <h2 className="text-xl font-bold mb-4">Metrics Model</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {modelMetrics.map((metric, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow border space-y-1">
                            <p className="text-sm text-gray-500">{metric.label}</p>
                            <p className="text-xl font-bold">{metric.value}</p>
                            <p className="text-xs text-gray-400">{metric.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}