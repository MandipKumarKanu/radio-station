# 📻 Nep Tune 🎶

Stream your favorite Nepali radio stations online, anytime, anywhere!

This project allows you to listen to top Nepali radio stations with a modern, responsive interface. It supports live streaming, real-time status updates, smooth audio controls, and even allows you to add custom stations and access your listening history.

---

## 🌟 Key Features

- 🔊 **Live Streaming**: Enjoy real-time streaming of top Nepali radio stations.
- 🎵 **Sleek & Modern UI**: A beautiful interface designed with React.js and Tailwind CSS.
- 🌐 **Real-Time Status**: Displays loading, playing, or error status for each station.
- 📡 **Multiple Stations**: A collection of popular Nepali radio stations, such as Sagarmatha, Koshi, and more.
- 🔁 **Smooth Controls**: Easy play/pause buttons, volume control, and mute options.
- 📜 **Listening History**: Tracks your listening history, so you can easily revisit your favorite stations.
- 📍 **Custom Radio Stations**: Users can add their own custom radio stations, and they are saved and managed in the app.
- 🌎 **Customizable**: Add, remove, and edit your custom radio stations anytime.
- 🔐 **Firebase Authentication**: Secure login with Google Authentication to access personalized features like history and custom stations.
- 📱 **Real-time Database**: Firebase is used to store and manage data, such as custom radio stations and user history.

---

## 🛠️ Tech Stack

- **Frontend**:
  - React.js: For building the UI and managing state.
  - Tailwind CSS: For styling and responsiveness.
  - React Icons: For enhanced iconography (play, pause, volume, etc.).
- **State Management**:
  - React Context API: Used to manage global state (like the audio player status).
  - Firebase: For storing custom radio stations, user data, and authentication.
- **Authentication**:
  - Firebase Authentication with Google Auth for secure user login.
- **Audio Streaming**:
  - Custom radio station URLs can be added to the app, and they can be streamed directly.

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

3. Set Up Firebase

   - If you haven't already, create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Set up Firebase Authentication with Google Auth and enable Firestore Database.
   - Configure Firebase in your project by creating a Firebase config file in `src/utils/firebase.config.js` with the appropriate credentials from your Firebase project.

4. Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173).

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
│   │   ├── Player.jsx       # Main Player Component
│   │   ├── History.jsx      # Displays the listening history
│   │   ├── CustomStations.jsx # Component for adding and managing custom stations
│   │   └── Dropdown.jsx     # Dropdown menu for each station (Edit, Delete)
│   ├── context
│   │   └── usePlayerContext.jsx  # Context for managing player state
│   ├── utils
│   │   └── firebase.config.js  # Firebase configuration and setup
└── README.md
```

---

## 📡 Add Your Own Stations

To add new radio stations, simply update the `radio_list.js` file located in `public/assets/`. Each radio station should have a unique `id`, `name`, `streamUrl`, and `frequency`.

Example:

```javascript
export const RadioList = [
  {
    id: "sl3ebLFmfp3eLlHbciODf",
    name: "Machhapuchhre FM",
    streamUrl: "https://live.itech.host:2680/stream",
    frequency: 91,
    address: "Pokhara, Kaski",
    province: 4,
  },
  {
    id: "63DAluhRgl-PcYeixk5eY",
    name: "Radio Nepal",
    streamUrl: "https://stream1.radionepal.gov.np/live",
    frequency: 100.0,
    address: "Kathmandu, Nepal",
    province: 3,
  },
];
```

Once added, the station will automatically be available on the app for streaming.

### **Custom Radio Stations**

Users can also add custom radio stations that will be stored and managed in Firebase. This allows you to add and remove your own stations dynamically.

**Custom Radio Station Structure:**

- **Station Name**: A unique name for the radio station.
- **Stream URL**: The stream URL for the radio station.
- **Added By**: The user who added the station.

---

## 🔄 Listening History

Your listening history is tracked automatically. Whenever you play a station, it gets added to your history. You can easily access and revisit stations you've listened to in the past. This feature ensures a personalized experience.

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
