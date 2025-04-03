# Portfolio Website v2.0

A modern, interactive portfolio website built with React and Vite, featuring a dynamic music library component that integrates with Spotify.

## Features

### Music Library Component
- **Spotify Integration**: Connect with your Spotify account to showcase your music taste
- **Now Playing**: Real-time display of currently playing track with dynamic color theming
- **Recently Played**: List of recently played tracks with play/pause controls
- **Album Collection**: Interactive 3D album wheel with smooth scrolling and hover effects
- **Responsive Design**: Fully responsive layout that works on all device sizes
- **Dark Mode Support**: Seamless dark/light mode switching
- **Playback Controls**: 
  - Play/pause functionality for individual tracks
  - Visual feedback for currently playing track
  - Spotify Premium integration for full playback control

## Tech Stack

- **Frontend Framework**: React
- **Build Tool**: Vite
- **Styling**: CSS3 with modern features (CSS Variables, Flexbox, Grid)
- **External APIs**: Spotify Web Playback SDK
- **State Management**: React Hooks (useState, useEffect, useRef, useCallback)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Spotify Premium account (for playback functionality)
- Spotify Developer account and application credentials

## Setup

1. Clone the repository:
```bash
git clone [your-repo-url]
cd portfolio
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with your Spotify credentials:
```env
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_client_secret
VITE_BACKEND_URL=http://localhost:5001
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
portfolio/
├── src/
│   ├── assets/          # Static assets (images, icons)
│   ├── components/      # React components
│   │   ├── MusicLibrary/
│   │   │   ├── MusicLibrary.jsx
│   │   │   └── MusicLibrary.css
│   │   └── ...
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
└── package.json
```

## Spotify Integration

The music library component requires:
1. A Spotify Developer account
2. A registered Spotify application
3. Proper CORS configuration on your backend
4. Spotify Premium account for playback functionality

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Spotify Web Playback SDK
- React and Vite communities
- All contributors and maintainers

## Contact

Your Name - [your-email@example.com]
Project Link: [https://github.com/yourusername/portfolio](https://github.com/yourusername/portfolio)
