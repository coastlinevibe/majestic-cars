import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageCircle, X, ThumbsUp, ThumbsDown, Mic, ArrowUp } from 'lucide-react';

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  feedback?: 'positive' | 'negative' | null;
}

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! How can I help you today?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, []);

  const handleSendMessage = (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleVoiceInput = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleMessageFeedback = (messageId: string, isPositive: boolean) => {
    // Update the message with feedback
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, feedback: isPositive ? 'positive' : 'negative' }
        : msg
    ));
    
    // Here you would typically send feedback to your backend
    console.log(`Message ${messageId} feedback: ${isPositive ? 'positive' : 'negative'}`);
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('financing') || message.includes('finance')) {
      return "We offer competitive financing options with rates starting from 7.5% APR. Our finance team can help you find the perfect payment plan that fits your budget. Would you like me to connect you with a financing specialist?";
    }
    
    if (message.includes('test drive') || message.includes('drive')) {
      return "Absolutely! We'd love to arrange a test drive for you. You can schedule one online or call us at 060 857 9146. Which vehicle are you interested in test driving?";
    }
    
    if (message.includes('trade') || message.includes('trade-in')) {
      return "Our trade-in process is simple and transparent. We provide competitive valuations and can apply your trade-in value directly to your new purchase. Would you like to get a quote for your current vehicle?";
    }
    
    if (message.includes('inventory') || message.includes('cars') || message.includes('vehicles')) {
      return "We have an extensive inventory of premium vehicles including BMW, Mercedes, and Audi. You can browse our complete inventory online or visit our showroom. Are you looking for a specific make or model?";
    }
    
    if (message.includes('hours') || message.includes('open')) {
      return "Our showroom hours are Monday-Friday 9AM-6PM, Saturday 10AM-4PM, and we're closed on Sunday. However, our online services are available 24/7!";
    }
    
    if (message.includes('location') || message.includes('address')) {
      return "We're located at 154 Sefako Makgatho Service Ln, Sinoville, Pretoria, 0129. We also have showrooms in Johannesburg and Cape Town. Would you like directions to any of our showrooms?";
    }
    
    return "Thank you for your question! I'd be happy to help you with that. For more detailed assistance, I can connect you with one of our specialists. You can also call us at 060 857 9146 or visit our contact page.";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <>
      {/* Chat Widget Button - Bottom Right Corner */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="flex flex-col items-end gap-2">
          {/* Chat Here Label */}
          <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-1 shadow-md">
            <p className="text-xs font-medium text-foreground/80">Chat Here!</p>
          </div>
          
          {/* Chat Button */}
          <Button
            onClick={() => setIsOpen(true)}
            size="sm"
            className="w-12 h-12 rounded-full shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 bg-primary hover:bg-primary-hover border-2 border-primary-foreground/10 p-0"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Chat Dialog - Large popup from bottom right */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className="max-w-xl w-full h-[380px] p-0 gap-0 fixed bottom-4 right-4 data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-2 [&>button]:hidden"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          {/* Custom Header - replaces default */}
          <div className="flex items-center justify-between p-4 pb-3 border-b bg-card rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Sterling Assistant</h3>
                <p className="text-sm text-muted-foreground">Online now</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[80%] ${message.isBot ? 'order-2' : 'order-1'}`}>
                  {message.isBot && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold text-xs">S</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Sterling Assistant</span>
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.isBot
                        ? 'bg-card border border-border text-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.isBot && (
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`h-6 w-6 p-0 hover:bg-muted transition-all duration-200 ${
                            message.feedback === 'positive' 
                              ? 'bg-green-100 text-green-600 hover:bg-green-100' 
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => handleMessageFeedback(message.id, true)}
                        >
                          <ThumbsUp className={`w-3 h-3 transition-all duration-200 ${
                            message.feedback === 'positive' ? 'scale-110' : 'hover:scale-105'
                          }`} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`h-6 w-6 p-0 hover:bg-muted transition-all duration-200 ${
                            message.feedback === 'negative' 
                              ? 'bg-red-100 text-red-600 hover:bg-red-100' 
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => handleMessageFeedback(message.id, false)}
                        >
                          <ThumbsDown className={`w-3 h-3 transition-all duration-200 ${
                            message.feedback === 'negative' ? 'scale-110' : 'hover:scale-105'
                          }`} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%]">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold text-xs">S</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Sterling Assistant</span>
                  </div>
                  <div className="bg-card border border-border rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-card rounded-b-lg">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter your message..."
                  className="pr-20 bg-background border-border h-12 text-base"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-8 w-8 p-0 ${isListening ? 'bg-primary/10 text-primary' : ''}`}
                    onClick={handleVoiceInput}
                    title={isListening ? 'Stop listening' : 'Start voice input'}
                  >
                    <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} />
                  </Button>
                  <Button 
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim()}
                    size="sm" 
                    className="h-8 w-8 p-0"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center mt-3">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="text-primary">⚡</span>
                Powered by Sterling Motors
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatbotWidget;