import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faPaperPlane, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { ChatMessage } from '../interface/prediction';

type ChatProps = {
    initialMessages: ChatMessage[];
};

export default function Chat({ initialMessages }: ChatProps) {
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const newChatMessage: ChatMessage = {
            id: Date.now().toString(),
            text: newMessage,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatMessages([...chatMessages, newChatMessage]);
        setNewMessage('');
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const systemResponse: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: 'Thank you for your message. I\'ll analyze this and get back to you shortly.',
                sender: 'system',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setChatMessages(prev => [...prev, systemResponse]);
        }, 2000);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                        icon={faComments}
                        className="h-5 w-5 text-blue-600"
                    />
                    <h2 className="text-xl font-semibold text-gray-800">Chat Assistant</h2>
                </div>
                {isTyping && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Assistant is typing</span>
                        <FontAwesomeIcon icon={faEllipsisH} className="h-4 w-4 animate-pulse" />
                    </div>
                )}
            </div>
            <div className="flex flex-col h-[600px]">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                    {chatMessages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'
                                }`}
                        >
                            <div
                                className={`rounded-lg px-4 py-2 max-w-[80%] ${message.sender === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                <p className="text-sm">{message.text}</p>
                            </div>
                            <span className="text-xs text-gray-500 mt-1">{message.timestamp}</span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="flex gap-2 mt-auto">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isTyping}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isTyping}
                        className="bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FontAwesomeIcon
                            icon={faPaperPlane}
                            className="h-5 w-5"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}