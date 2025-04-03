# Portfolio Website v2.0

A modern, interactive portfolio website built with React and Vite, featuring a dynamic music library component that integrates with Spotify.

## Features

### Music Library Component
- **Spotify API**: Connect Spotify account
- **Now Playing**: Current playing track
- **Recently Played**: Recently played tracks
- **Album Collection**: 3D album wheel
- **Playback Controls**: 
  - Play/pause functionality for individual tracks
  - Visual feedback for currently playing track

## Tech Stack

- **Frontend Framework**: React
- **Build Tool**: Vite
- **Styling**: CSS3 with modern features 
- **External APIs**: Spotify Web Playback SDK
- **State Management**: React Hooks (useState, useEffect, useRef, useCallback)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Spotify Account
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

## Spotify Integration

The music library component requires:
1. A Spotify Developer account
2. A registered Spotify application
3. Proper CORS configuration on your backend
4. Spotify Premium account for playback functionality

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Spotify Web Playback SDK
- React and Vite communities
- All contributors and maintainers

## Contact

Your Name - [seestedttrevor@gmail.com]
Project Link: [hhttps://github.com/TrevorSeestedt]
