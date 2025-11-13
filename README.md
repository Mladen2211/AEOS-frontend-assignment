# Beer Catalog App

A modern Angular application for browsing and discovering beers using the Punk API.

**This is a frontend assignment given to me by AEOS (All Eyes On Screens).**

## Features

- **Beer Catalog**: Browse through a comprehensive collection of beers with detailed information
- **Advanced Filtering**: Filter by name, alcohol content, and favorites
- **Sorting Options**: Sort by name (A-Z, Z-A) or alcohol content (Low-High, High-Low)
- **Favorites System**: Mark beers as favorites with local storage persistence
- **Lazy Loading**: Images load only when visible for optimal performance
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Pagination**: Load more beers with scroll position preservation
- **Rate Limiting**: Built-in protection against API rate limits with automatic retry

## Technologies Used

- **Angular 20**: Modern framework with standalone components
- **NgRx**: State management with store, effects, and selectors
- **Tailwind CSS**: Utility-first styling with custom yellow theme
- **RxJS**: Reactive programming for API calls and state management
- **Punk API**: External beer data source (https://api.adscanner.tv/punkapi/v2/)

## Getting Started

### Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Open your browser** and navigate to `http://localhost:4200`

### Docker Setup

**Quick start with Docker Compose:**
```bash
docker-compose up --build
```
Then visit `http://localhost:8080`

**Manual Docker build:**
```bash
# Build the Docker image
docker build -t beer-catalog-app .

# Run the container
docker run -p 8080:80 beer-catalog-app
```

The Docker setup uses a multi-stage build process:
- **Build stage**: Uses Node.js to compile the Angular application
- **Production stage**: Uses Nginx to serve the static files efficiently

## Project Structure

```
src/
├── app/
│   ├── components/          # UI components
│   │   ├── beer-card/       # Individual beer display
│   │   ├── beer-detail-modal/ # Beer details popup
│   │   ├── filters/         # Search and filter controls
│   │   ├── header/          # App header with logo
│   │   └── footer/          # App footer
│   ├── models/              # TypeScript interfaces
│   ├── services/            # API and business logic
│   ├── store/               # NgRx state management
│   └── http-error.interceptor.ts # HTTP error handling
└── assets/                  # Static assets (images, icons)
```

## Performance Optimizations

- OnPush change detection strategy
- Lazy image loading with Intersection Observer
- Debounced search (300ms delay)
- Concurrent request limiting (max 3 simultaneous image loads)
- Scroll position preservation during pagination