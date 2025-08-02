// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Chatbot Application
class GeminiChatbot {
    constructor() {
        this.apiKey = null;
        this.chatHistory = [];
        this.isTyping = false;
        this.isMobile = this.detectMobile();
        
        // DOM Elements
        this.elements = {
            chatMessages: document.getElementById('chatMessages'),
            messageInput: document.getElementById('messageInput'),
            sendButton: document.getElementById('sendButton'),
            typingIndicator: document.getElementById('typingIndicator'),
            apiKeyModal: document.getElementById('apiKeyModal'),
            errorModal: document.getElementById('errorModal'),
            apiKeyInput: document.getElementById('apiKeyInput'),
            rememberKey: document.getElementById('rememberKey'),
            saveApiKey: document.getElementById('saveApiKey'),
            clearChat: document.getElementById('clearChat'),
            exportChat: document.getElementById('exportChat'),
            statusText: document.querySelector('.status-text'),
            statusDot: document.querySelector('.status-dot')
        };
        
        this.initializeApp();
        this.bindEvents();
        this.setupMobileOptimizations();
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }
    
    setupMobileOptimizations() {
        if (this.isMobile) {
            // Prevent zoom on input focus
            this.elements.messageInput.addEventListener('focus', () => {
                setTimeout(() => {
                    this.elements.messageInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
            
            // Add touch feedback
            this.addTouchFeedback();
            
            // Handle viewport height on mobile browsers
            this.setViewportHeight();
            window.addEventListener('resize', () => this.setViewportHeight());
        }
    }
    
    setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    addTouchFeedback() {
        const touchElements = [
            this.elements.sendButton,
            this.elements.clearChat,
            this.elements.exportChat,
            ...document.querySelectorAll('.action-button'),
            ...document.querySelectorAll('.btn'),
            ...document.querySelectorAll('.modal-close')
        ];
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.95)';
            });
            
            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.style.transform = '';
                }, 150);
            });
        });
    }
    
    initializeApp() {
        // Check for saved API key
        const savedApiKey = localStorage.getItem('gemini_api_key');
        if (savedApiKey) {
            this.apiKey = savedApiKey;
            this.updateStatus('Ready', 'success');
        } else {
            this.showApiKeyModal();
        }
        
        // Load chat history
        this.loadChatHistory();
        
        // Auto-resize textarea
        this.autoResizeTextarea();
        
        // Add keyboard shortcuts
        this.setupKeyboardShortcuts();
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to send message
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.sendMessage();
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                this.hideApiKeyModal();
                this.hideErrorModal();
            }
        });
    }
    
    bindEvents() {
        // Send message events
        this.elements.sendButton.addEventListener('click', () => this.sendMessage());
        this.elements.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Modal events
        this.elements.saveApiKey.addEventListener('click', () => this.saveApiKey());
        this.elements.closeModal.addEventListener('click', () => this.hideApiKeyModal());
        this.elements.closeErrorModal.addEventListener('click', () => this.hideErrorModal());
        this.elements.closeErrorBtn.addEventListener('click', () => this.hideErrorModal());
        
        // Action buttons
        this.elements.clearChat.addEventListener('click', () => this.clearChat());
        this.elements.exportChat.addEventListener('click', () => this.exportChat());
        
        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target === this.elements.apiKeyModal) {
                this.hideApiKeyModal();
            }
            if (e.target === this.elements.errorModal) {
                this.hideErrorModal();
            }
        });
        
        // Auto-resize textarea on input
        this.elements.messageInput.addEventListener('input', () => this.autoResizeTextarea());
        
        // Handle paste events
        this.elements.messageInput.addEventListener('paste', (e) => {
            setTimeout(() => this.autoResizeTextarea(), 0);
        });
    }
    
    autoResizeTextarea() {
        const textarea = this.elements.messageInput;
        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, 120);
        textarea.style.height = newHeight + 'px';
        
        // Update send button state
        this.elements.sendButton.disabled = !textarea.value.trim();
    }
    
    showApiKeyModal() {
        this.elements.apiKeyModal.classList.add('show');
        this.elements.apiKeyInput.focus();
        
        // Prevent body scroll on mobile
        if (this.isMobile) {
            document.body.style.overflow = 'hidden';
        }
    }
    
    hideApiKeyModal() {
        this.elements.apiKeyModal.classList.remove('show');
        
        // Restore body scroll
        if (this.isMobile) {
            document.body.style.overflow = '';
        }
    }
    
    showErrorModal(message) {
        document.getElementById('errorMessage').textContent = message;
        this.elements.errorModal.classList.add('show');
        
        // Prevent body scroll on mobile
        if (this.isMobile) {
            document.body.style.overflow = 'hidden';
        }
    }
    
    hideErrorModal() {
        this.elements.errorModal.classList.remove('show');
        
        // Restore body scroll
        if (this.isMobile) {
            document.body.style.overflow = '';
        }
    }
    
    saveApiKey() {
        const apiKey = this.elements.apiKeyInput.value.trim();
        const remember = this.elements.rememberKey.checked;
        
        if (!apiKey) {
            this.showErrorModal('Please enter a valid API key.');
            return;
        }
        
        this.apiKey = apiKey;
        
        if (remember) {
            localStorage.setItem('gemini_api_key', apiKey);
        }
        
        this.hideApiKeyModal();
        this.updateStatus('Ready', 'success');
        this.elements.apiKeyInput.value = '';
    }
    
    updateStatus(text, type = 'default') {
        this.elements.statusText.textContent = text;
        this.elements.statusDot.className = 'status-dot ' + type;
    }
    
    async sendMessage() {
        if (!this.apiKey) {
            this.showApiKeyModal();
            return;
        }
        
        const message = this.elements.messageInput.value.trim();
        if (!message || this.isTyping) return;
        
        // Add user message to chat
        this.addMessage(message, 'user');
        this.elements.messageInput.value = '';
        this.autoResizeTextarea();
        
        // Show typing indicator
        this.showTypingIndicator();
        this.isTyping = true;
        this.updateStatus('Typing...', 'typing');
        
        try {
            const response = await this.callGeminiAPI(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'bot');
            this.updateStatus('Ready', 'success');
        } catch (error) {
            this.hideTypingIndicator();
            this.showErrorModal(`Error: ${error.message}`);
            this.updateStatus('Error', 'error');
        }
        
        this.isTyping = false;
    }
    
    async callGeminiAPI(message) {
        const url = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: message
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        };
        
        const response = await fetch(`${url}?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to get response from Gemini API');
        }
        
        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid response from Gemini API');
        }
        
        return data.candidates[0].content.parts[0].text;
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        messageText.textContent = text;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = this.getCurrentTime();
        
        content.appendChild(messageText);
        content.appendChild(messageTime);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        this.elements.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Save to chat history
        this.chatHistory.push({
            text,
            sender,
            timestamp: new Date().toISOString()
        });
        this.saveChatHistory();
    }
    
    showTypingIndicator() {
        this.elements.typingIndicator.style.display = 'block';
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.elements.typingIndicator.style.display = 'none';
    }
    
    scrollToBottom() {
        setTimeout(() => {
            const chatContainer = this.elements.chatMessages.parentElement;
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 100);
    }
    
    getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    
    clearChat() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            this.elements.chatMessages.innerHTML = '';
            this.chatHistory = [];
            localStorage.removeItem('chat_history');
            
            // Add welcome message back
            const welcomeDiv = document.createElement('div');
            welcomeDiv.className = 'message bot-message';
            welcomeDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-text">
                        Hello! I'm Gemini, your AI assistant. How can I help you today?
                    </div>
                    <div class="message-time">Just now</div>
                </div>
            `;
            this.elements.chatMessages.appendChild(welcomeDiv);
        }
    }
    
    exportChat() {
        if (this.chatHistory.length === 0) {
            this.showErrorModal('No chat history to export.');
            return;
        }
        
        const chatText = this.chatHistory.map(msg => {
            const time = new Date(msg.timestamp).toLocaleString();
            return `[${time}] ${msg.sender.toUpperCase()}: ${msg.text}`;
        }).join('\n\n');
        
        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gemini-chat-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    saveChatHistory() {
        localStorage.setItem('chat_history', JSON.stringify(this.chatHistory));
    }
    
    loadChatHistory() {
        const saved = localStorage.getItem('chat_history');
        if (saved) {
            try {
                this.chatHistory = JSON.parse(saved);
                this.renderChatHistory();
            } catch (error) {
                console.error('Error loading chat history:', error);
                localStorage.removeItem('chat_history');
            }
        }
    }
    
    renderChatHistory() {
        // Clear existing messages except welcome message
        const welcomeMessage = this.elements.chatMessages.querySelector('.bot-message');
        this.elements.chatMessages.innerHTML = '';
        
        if (welcomeMessage) {
            this.elements.chatMessages.appendChild(welcomeMessage);
        }
        
        // Render chat history
        this.chatHistory.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.sender}-message`;
            
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.innerHTML = msg.sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
            
            const content = document.createElement('div');
            content.className = 'message-content';
            
            const messageText = document.createElement('div');
            messageText.className = 'message-text';
            messageText.textContent = msg.text;
            
            const messageTime = document.createElement('div');
            messageTime.className = 'message-time';
            messageTime.textContent = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            content.appendChild(messageText);
            content.appendChild(messageTime);
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(content);
            
            this.elements.chatMessages.appendChild(messageDiv);
        });
        
        this.scrollToBottom();
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GeminiChatbot();
});

// Add some utility functions for better UX
document.addEventListener('keydown', (e) => {
    // Escape key to close modals
    if (e.key === 'Escape') {
        const apiKeyModal = document.getElementById('apiKeyModal');
        const errorModal = document.getElementById('errorModal');
        
        if (apiKeyModal.classList.contains('show')) {
            apiKeyModal.classList.remove('show');
        }
        if (errorModal.classList.contains('show')) {
            errorModal.classList.remove('show');
        }
    }
});

// Add loading animation for better visual feedback
function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

// Add smooth scrolling for better UX
function smoothScrollTo(element, duration = 300) {
    const targetPosition = element.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
} 