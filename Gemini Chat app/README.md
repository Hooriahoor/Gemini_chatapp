# Gemini Chat - AI Assistant

A modern, responsive web application for chatting with Google's Gemini AI model. Built with vanilla JavaScript, HTML, and CSS, featuring a beautiful UI and excellent mobile experience.

## ✨ Features

- 🤖 **AI Chat Interface**: Chat with Google's Gemini AI model
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- ⚡ **PWA Ready**: Installable as a web app on mobile devices
- 🔒 **Secure**: API keys stored locally with user consent
- 💾 **Offline Support**: Service worker for caching and offline functionality
- ⌨️ **Keyboard Shortcuts**: Ctrl/Cmd + Enter to send messages
- 📤 **Export Chat**: Download chat history as text file
- 🗑️ **Clear Chat**: Easy chat history management
- ♿ **Accessible**: WCAG compliant with keyboard navigation

## 🚀 Live Demo

Your website is now ready for deployment! Here are some options to get a live URL:

### Option 1: Netlify (Recommended)
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Deploy automatically

### Option 2: Vercel
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Deploy with one click

### Option 3: GitHub Pages
1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Select source branch (usually `main`)
4. Your site will be available at `https://username.github.io/repository-name`

### Option 4: Local Development Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

## 🛠️ Setup Instructions

1. **Clone or download** this repository
2. **Get a Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key for use in the app

3. **Open the application**:
   - Open `index.html` in your browser
   - Enter your API key when prompted
   - Start chatting!

## 📱 Mobile Features

- **Touch Optimized**: Large touch targets and smooth touch feedback
- **Viewport Handling**: Proper handling of mobile browser viewport
- **Keyboard Management**: Smart keyboard handling on mobile devices
- **Installable**: Can be installed as a PWA on mobile devices
- **Offline Support**: Works offline with cached resources

## 🎨 Design Features

- **Responsive Breakpoints**:
  - Desktop: 1024px+
  - Tablet: 768px - 1023px
  - Mobile: 480px - 767px
  - Small Mobile: 360px - 479px
  - Extra Small: < 360px

- **Accessibility**:
  - High contrast mode support
  - Reduced motion support
  - Keyboard navigation
  - Screen reader friendly

## 🔧 Technical Details

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **AI Integration**: Google Gemini API
- **Storage**: Local Storage for chat history and API keys
- **PWA**: Service Worker for offline functionality
- **Performance**: Optimized loading and caching

## 📁 File Structure

```
gemini-chat-app/
├── index.html          # Main HTML file
├── styles.css          # Responsive CSS styles
├── script.js           # JavaScript functionality
├── sw.js              # Service Worker
├── site.webmanifest   # PWA manifest
└── README.md          # This file
```

## 🔒 Privacy & Security

- API keys are stored locally in browser storage
- No data is sent to external servers except Google's Gemini API
- Chat history is stored locally and can be cleared anytime
- No tracking or analytics included

## 🐛 Troubleshooting

**API Key Issues:**
- Ensure your API key is valid and has proper permissions
- Check if you have sufficient quota for the Gemini API

**Mobile Issues:**
- Clear browser cache if the app doesn't load properly
- Ensure you're using a modern browser (Chrome, Safari, Firefox)

**Offline Issues:**
- The service worker may take a moment to cache resources
- Check browser console for any service worker errors

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve this application.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- Font Awesome for icons
- Inter font family for typography
- Modern CSS features for responsive design

---

**Enjoy chatting with Gemini AI! 🚀** 