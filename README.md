# دَنگ و دونگ (Dang O Dong) 💰

> نرم‌افزار تقسیم هزینه‌ها - Persian Cost Splitting Application

[![React](https://img.shields.io/badge/React-18.0.0-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-blue.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Language](https://img.shields.io/badge/Language-Persian-red.svg)](https://github.com/MrArvand/dang-o-dong)

A modern, responsive web application for splitting expenses among friends and family. Built with React and Tailwind CSS, featuring a beautiful Persian UI with RTL support.

## ✨ Features

- **👥 Member Management**: Add and manage group members
- **💰 Expense Tracking**: Record expenses with detailed descriptions
- **🧮 Smart Calculations**: Automatic calculation of debts and credits
- **📱 Responsive Design**: Works perfectly on mobile and desktop
- **🌙 Dark/Light Theme**: Toggle between themes
- **🔗 Share Functionality**: Share expense data via URL
- **📊 Settlement Instructions**: Clear payment instructions for debt settlement
- **🎨 Persian UI**: Beautiful Persian interface with RTL support
- **💾 Local Storage**: Data persistence across sessions
- **⚡ Fast Loading**: Optimized performance with preloader

## 🚀 Live Demo

[View Live Demo](https://your-demo-link.com)

## 🛠️ Technology Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Font**: Vazirmatn (Persian-optimized)
- **Build Tool**: Create React App
- **Deployment**: Vercel/Netlify ready

## 📦 Installation

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/MrArvand/dang-o-dong.git
   cd dang-o-dong
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Build for Production

```bash
npm run build
```

The build files will be created in the `build/` directory.

## 📱 Usage

### Adding Members

1. Go to the "اعضا و هزینه‌ها" (Members & Expenses) tab
2. Enter member name in the input field
3. Click "افزودن عضو" (Add Member)

### Adding Expenses

1. Select a member from the list
2. Click the expand button to add expenses
3. Enter expense description and amount
4. Select participants
5. Click "افزودن هزینه" (Add Expense)

### Viewing Settlements

1. Go to the "تسویه حساب" (Settlement) tab
2. View the summary cards showing total expenses
3. Check the settlement instructions for payment details

### Sharing Data

1. Click the "اشتراک‌گذاری" (Share) button
2. Copy the generated link
3. Share with friends to view the same data

## 🎨 Customization

### Theme Colors

Modify colors in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    // ... more shades
  }
}
```

### Font

The app uses Vazirmatn font for Persian text. You can change it in `tailwind.config.js`:

```javascript
fontFamily: {
  'vazir': ['Vazirmatn', 'sans-serif'],
}
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── MemberExpenseManager.js
│   ├── SettlementResults.js
│   ├── ThemeToggle.js
│   ├── ShareButton.js
│   ├── ShareIndicator.js
│   └── Preloader.js
├── utils/              # Utility functions
│   ├── calculationUtils.js
│   ├── persianUtils.js
│   └── shareUtils.js
├── App.js              # Main application component
├── index.js            # Application entry point
└── index.css           # Global styles
```

## 🌐 Deployment

### GitHub Pages (Automated)

This project includes a GitHub Actions workflow for automatic deployment to GitHub Pages.

#### Setup Instructions:

1. **Update the homepage URL** in `package.json`:
   ```json
   "homepage": "https://[your-username].github.io/dang-o-dong"
   ```
   Replace `[your-username]` with your actual GitHub username.

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Set source to "GitHub Actions"

3. **Push to main branch**:
   The workflow will automatically:
   - Build your React app
   - Deploy to GitHub Pages
   - Update on every push to main/master branch

#### Manual Deployment:
```bash
npm run build
# Upload build/ folder contents to GitHub Pages
```

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Netlify

1. Build the project: `npm run build`
2. Upload the `build/` folder to Netlify
3. Configure redirects for SPA routing

### Hostinger Shared Hosting

1. Build the project: `npm run build`
2. Upload contents of `build/` folder to your hosting
3. Add `.htaccess` file for SPA routing:
   ```apache
   RewriteEngine On
   RewriteBase /
   RewriteRule ^index\.html$ - [L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vazirmatn Font](https://github.com/rastikerdar/vazirmatn) for Persian typography
- [Heroicons](https://heroicons.com/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [React](https://reactjs.org/) for the amazing framework

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Contact: [mr.arvand1@gmail.com]
- Website: [arvand.dev]

---

Made with ❤️ by [Arvand](https://github.com/MrArvand)
