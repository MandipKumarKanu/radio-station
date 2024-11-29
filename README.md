# 📻 Nepali Radio Stations 🎶

Stream your favorite Nepali radio stations online, anytime, anywhere!

This project allows you to listen to top Nepali radio stations with a modern, responsive interface. It supports live streaming, real-time status updates, and smooth audio controls.

---

## 🌟 Key Features

- 🔊 Live Streaming: Enjoy real-time streaming of top Nepali radio stations.
- 🎵 Sleek & Modern UI: A beautiful interface designed with React.js and Tailwind CSS.
- 🌐 Real-Time Status: Displays loading, playing, or error status for each station.
- 📡 Multiple Stations: A collection of popular Nepali radio stations, such as Sagarmatha, Koshi, and more.
- 🔁 Smooth Controls: Easy play/pause buttons, volume control, and mute options.

---

## 🛠️ Tech Stack

- Frontend:
  - React.js: For building the UI and managing state.
  - Tailwind CSS: For styling and responsiveness.
  - React Icons: For enhanced iconography (play, pause, volume, etc.).
- State Management:
  - React Context API: Used to manage global state (like the audio player status).

---

## 🚀 Getting Started

Follow these steps to get the project up and running on your local machine:

1. Clone the Repository

```bash
git clone https://github.com/MandipKumarKanu/radio-station.git
cd nepali-radio-stations
```

2. Install Dependencies

```bash
npm install
```

3. Start the Development Server

```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## 📁 Project Structure

Here's a breakdown of the project directory:

```
├── public
│   └── assets
│       ├── logo
│       │   └── logo1.jpg    # Logo of Nepali radio stations logo
│       └── radio_list.js    # List of Nepali radio stations with stream URLs
├── src
│   ├── components
│   │   ├── PlayBtn.jsx      # Play/Pause Button Component
│   │   └── Player.jsx       # Main Player Component
│   └── context
│       └── usePlayerContext.jsx  # Context for managing player state
└── README.md
```

---

## 📡 Add Your Own Stations

To add new radio stations, simply update the `radio_list.js` file located in `public/assets/`. Each radio station should have a unique `id`, `name`, `streamUrl`, and `frequency`.

Example:

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

Once added, the station will automatically be available on the app for streaming.

**Streaming & Logo Reference:** [2shrestha22/radio GitHub repository](https://github.com/2shrestha22/radio/tree/main/assets)

---

## 🌐 Live Demo

You can also try the live demo of this project by visiting:

[**Live Demo URL**](https://nep-tune.web.app/)

---

## 🤝 Contributing

Feel free to contribute to this project by opening pull requests or issues. Whether it’s a bug fix, feature request, or a new station to add, your contributions are welcome!

---

## 💬 Contact

For any questions or suggestions, feel free to reach out to me:

- Email: [mandipshah3@gmail.com](mailto:mandipshah3@gmail.com)
- GitHub: [@MandipKumarKanu](https://github.com/MandipKumarKanu)

---
