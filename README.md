# SetPiece

A modern e-commerce web application for soccer/football apparel and accessories, built with Next.js.

## Features

- **Product Catalog**: Browse collections including new arrivals, hoodies & joggers, soccer shorts, accessories, and more
- **Shopping Cart**: Add items to cart and manage quantities
- **Wishlist**: Save favorite items for later
- **Search**: Find products quickly
- **Responsive Design**: Optimized for all screen sizes
- **Smooth Animations**: Powered by Framer Motion

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd setpiece
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
app/
├── components/        # Reusable UI components
│   ├── home/         # Homepage sections
│   ├── layout/       # Layout components (Header, Footer, NavBar)
│   └── product/      # Product-related components
├── context/          # React Context providers (Cart, Wishlist)
├── lib/              # Mock data and utilities
├── cart/             # Cart page
├── collections/      # Collection pages
├── products/         # Product detail pages
└── search/           # Search functionality
```

## License

This project is private.
