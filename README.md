# 🎬 EtFlix - Premium Movie Streaming Platform

A modern, feature-rich movie streaming web application built with React, featuring an elegant UI, advanced filtering, pagination, and smooth animations.

![EtFlix Preview](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

## ✨ Features

### 🎥 Core Functionality

- **Premium Movie Catalog** - Curated collection of movies and series with high-quality backdrop images
- **Advanced Filtering** - Filter by type (Movies/Series), genre, year, and sort options
- **Smart Pagination** - Smooth navigation with 12 items per page
- **Search Functionality** - Real-time search across titles and genres
- **Responsive Design** - Optimized for all screen sizes (mobile, tablet, desktop)

### 📄 Pages

- **Home** - Featured hero section with trending, popular, and new release sections
- **Movies** - Complete catalog with filtering and pagination
- **Genres** - Browse 12 distinct genre categories with beautiful card layouts
- **About** - Learn about the platform's mission and features
- **Authentication** - Sign in and sign up pages (UI ready)

### 🎨 Design Highlights

- **Glass Morphism** - Modern frosted glass effects with backdrop blur
- **Smooth Animations** - GSAP-powered entrance effects and transitions
- **Premium Cards** - Hover effects with gradient borders and elevation
- **Brand Color Integration** - Consistent green accent (#b8ef61) throughout
- **Professional Spacing** - Carefully crafted visual hierarchy

### 🚀 Interactive Elements

- **Action Buttons** - Watchlist and favorite buttons on movie cards (hover to reveal)
- **Dynamic Navbar** - Fixed positioning with scroll effects and active link detection
- **Filter System** - Single-row compact filter bar with custom styled dropdowns
- **Pagination Controls** - Previous/Next buttons with page number indicators

## 🛠️ Technologies Used

### Frontend Framework

- **React** (v18.3.1) - Modern UI library with hooks
- **React Router DOM** (v7.6.3) - Client-side routing
- **Vite** (v6.2.0) - Next-generation build tool

### Animation & Effects

- **GSAP** (v3.12.7) - Professional-grade animation library
- **ScrollTrigger** - Scroll-based animations

### Development Tools

- **ESLint** (v9.18.0) - Code quality and style enforcement
- **PostCSS** - CSS processing
- **Autoprefixer** - Automatic vendor prefixing

### Languages

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-Modern-1572B6?style=flat-square&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-Semantic-E34F26?style=flat-square&logo=html5&logoColor=white)

## 📦 Installation

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm or yarn package manager

### Steps

1. **Clone the repository**

   ```bash
   git clone git@github.com:Ab-xo/EtFlix.git
   cd EtFlix
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🚀 Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

The production-ready files will be generated in the `dist/` folder.

## 📁 Project Structure

```
etflix/
├── public/                 # Static assets
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/            # Images and media files
│   │   ├── hero.png
│   │   └── *.svg
│   ├── components/        # Reusable React components
│   │   ├── Brand.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── MovieCard.jsx
│   │   ├── MovieSection.jsx
│   │   └── Navbar.jsx
│   ├── data/             # Static data and content
│   │   └── movie.js
│   ├── pages/            # Page-level components
│   │   ├── Home.jsx
│   │   ├── MoviesPage.jsx
│   │   ├── GenresPage.jsx
│   │   ├── AboutPage.jsx
│   │   └── AccountPage.jsx
│   ├── App.jsx           # Main app component with routing
│   ├── App.css           # Global styles
│   ├── index.css         # Base styles and CSS reset
│   └── main.jsx          # Application entry point
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── eslint.config.js      # ESLint configuration
└── README.md             # Project documentation
```

## 🎯 Key Components

### MovieCard

- Displays movie poster with 2:3 aspect ratio
- Hover effects reveal action buttons (watchlist, favorite)
- Gradient borders and multi-layer shadows
- Rating display with star icon

### Filter System

- Type selector (All/Movies/Series)
- Genre dropdown with dynamic options
- Year filter with sorted years
- Sort options (Latest, Top Rated, A-Z)
- Results counter with green badge

### Pagination

- 12 items per page
- Page number buttons with active state
- Previous/Next navigation
- Smooth scroll to top on page change
- Automatic reset when filters change

### Hero Section

- Full-width cinematic backdrop
- Featured movie information
- Play and More Info buttons
- TMDB rating badge
- Responsive height and padding

## 🎨 Design System

### Color Palette

```css
--brand-green: #b8ef61;
--light-green: #d8ff9d;
--background: #0b0c0a;
--text-primary: #f5f1e9;
--text-secondary: #98928a;
--text-tertiary: #7a7469;
```

### Typography

- System fonts for native feel
- Fluid sizing with `clamp()`
- Negative letter-spacing for modern look
- Optimized line-height for readability

### Effects

- Glass morphism with 24px backdrop blur
- Multi-layer shadows for depth
- Cubic-bezier easing for natural motion
- 250-350ms transition durations

## 📱 Responsive Breakpoints

```css
Desktop:  > 1024px  (Primary design)
Tablet:   768px - 1024px
Mobile:   < 768px
Small:    < 480px
```

## 🔧 Available Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Create optimized production build        |
| `npm run preview` | Preview production build locally         |
| `npm run lint`    | Run ESLint for code quality checks       |

## 🌟 Features in Detail

### Home Page

- **Hero Section**: Auto-rotating featured movies with stunning backdrops
- **Trending**: Latest movies from 2024+
- **Popular**: Highly-rated content (8.0+ rating)
- **New Releases**: Recent additions (2023-2024)

### Movies Page

- **Complete Catalog**: All movies and series in one place
- **Advanced Filters**: Multiple filter options work together
- **Pagination**: Navigate through pages smoothly
- **Empty State**: Helpful message when no results match

### Genres Page

- **12 Categories**: Action, Drama, Sci-Fi, Horror, Comedy, Animation, Crime, Adventure, Music, History, Thriller, Fantasy
- **Interactive Cards**: Hover effects with emoji icons
- **Title Counts**: Shows number of titles per genre
- **Quick Navigation**: Click to explore genre content

### About Page

- **Company Story**: Mission and vision
- **Feature Highlights**: Three key value propositions
- **Call-to-Action**: Prominent sign-up encouragement

## 🔮 Future Enhancements

- [ ] Backend integration with real movie database API
- [ ] User authentication and profile management
- [ ] Watchlist and favorites persistence
- [ ] Video player integration
- [ ] Social features (reviews, ratings, comments)
- [ ] Recommendation engine
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Advanced search with autocomplete
- [ ] Content rating and parental controls

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Abraham Gebeyehu**

- GitHub: [@Ab-xo](https://github.com/Ab-xo)

## 🙏 Acknowledgments

- Movie data and images from various sources
- Inspiration from modern streaming platforms
- GSAP for amazing animation capabilities
- React community for excellent tooling

## 📸 Screenshots

### Home Page

Beautiful hero section with featured content and curated collections.

### Movies Page

Advanced filtering with pagination for easy browsing.

### Genres Page

Browse content by 12 distinct genre categories.

### About Page

Learn about the platform's mission and features.

---

<div align="center">
  <p>Made with ❤️ and React</p>
  <p>⭐ Star this repo if you like it!</p>
</div>
