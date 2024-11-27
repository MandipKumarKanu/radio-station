# 📻 Nepali Radio Stations 🎶

**Stream your favorite Nepali radio stations online, anytime, anywhere!**

---

## 🌟 Features

- 🔊 **Live Streaming** of top Nepali radio stations.
- 🎵 **Modern & Responsive** UI with a sleek music pulse effect.
- 🌐 **Real-time Status** of each station (Loading, Playing, Error).
- 📡 **Multiple Stations** from across Nepal, including Sagarmatha, Koshi, and more.
- 🔁 **Smooth Play/Pause Controls** with volume and mute options.

---

## 🛠️ Tech Stack

- **Frontend**:

  - React.js
  - Tailwind CSS
  - React Icons (for beautiful icons)

- **State Management**:
  - React Context API

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/nepali-radio-stations.git
cd nepali-radio-stations
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm start
```

The project will run at [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

```
├── public
│   └── assets
│       └── radio_list.js    # List of Nepali radio stations with stream URLs
├── src
│   ├── components
│   │   ├── PlayBtn.jsx      # Play/Pause Button Component
│   │   ├── Player.jsx       # Main Player Component
│   │   └── WavyIcon.jsx     # Wavy animation icon for active streams
│   └── context
│       └── usePlayerContext.jsx  # Context for managing player state
└── README.md
```

---

## 📡 Add Your Own Stations

You can add more stations by editing the `radio_list.js` file in the `public/assets/` directory:

```javascript
export const RadioList = [
  {
    id: "radio_kantipur",
    name: "Radio Kantipur",
    streamUrl: "http://stream-url.com",
    frequency: "96.1",
  },
  {
    id: "sagarmatha_fm",
    name: "Sagarmatha FM",
    streamUrl: "http://stream-url.com",
    frequency: "102.4",
  },
];
```

---

## 🌐 Live Demo

[**Live Project URL**](https://your-live-demo-url.com)

---
