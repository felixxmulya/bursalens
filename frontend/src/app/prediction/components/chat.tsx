import { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faRobot, faUser } from '@fortawesome/free-solid-svg-icons';
import { Message } from '@/app/prediction/components/stock';

interface chatProps {
    messages: Message[];
    input: string;
    setInput: (input: string) => void;
    handleSendMessage: () => void;
}

export default function Chat({ 
    messages, 
    input, 
    setInput, 
    handleSendMessage 
}: chatProps) {
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6">AI Stock Advisor</h2>
            <div ref={chatRef} className="bg-gray-50 rounded-xl p-4 h-[500px] overflow-y-auto mb-4">
                {messages.map((message, index) => (
                    <div 
                        key={index}
                        className={`flex items-start mb-4 ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        {message.role === 'assistant' && (
                            <div className="bg-blue-600 rounded-full p-2 mr-3">
                                <FontAwesomeIcon icon={faRobot} className="text-white w-4 h-4" />
                            </div>
                        )}
                        <div className={`max-w-[80%] rounded-2xl p-4 ${
                            message.role === 'user' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white shadow-sm'
                        }`}>
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs mt-2 opacity-70">
                                {message.timestamp.toLocaleTimeString()}
                            </p>
                        </div>
                        {message.role === 'user' && (
                            <div className="bg-gray-600 rounded-full p-2 ml-3">
                                <FontAwesomeIcon icon={faUser} className="text-white w-4 h-4" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about any Indonesian stock..."
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <button
                    onClick={handleSendMessage}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700"
                >
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </div>
        </div>
    );
}