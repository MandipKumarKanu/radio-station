# 📻 Nep Tune 🎶

Stream your favorite Nepali radio stations online, anytime, anywhere!

This project allows you to enjoy top Nepali radio stations with a modern, responsive interface. It supports live streaming, real-time status updates, smooth audio controls, and even lets you add custom stations while accessing your listening history.

---

## 🌟 Key Features

- 🔊 **Live Streaming**: Real-time streaming of top Nepali radio stations.
- 🎵 **Sleek & Modern UI**: Built using React.js and styled with Tailwind CSS for responsiveness.
- 🌐 **Real-Time Status**: Displays loading, playing, or error status for each station.
- 📢 **Multiple Stations**: Includes popular stations like Sagarmatha FM, Koshi FM, and more.
- ♻️ **Smooth Controls**: Intuitive play/pause, volume, and mute controls.
- 🔖 **Listening History**: Tracks your listening history for easy revisits to favorite stations.
- 📍 **Custom Radio Stations**: Add your own stations just by a stream url
- 🔒 **Firebase Authentication**: Secure Google login to personalize features like history and custom stations.
- 📊 **Firebase Integration**: Real-time database for managing user-added stations and data.
- 📹 **Public Station Management**: Admins can manage public stations via `/manage` and add via `/addstations`, including updating and deleting.
- 📣 **Image Upload with ImgBB API**: Upload station logos seamlessly during station creation.

---

## 💡 Tech Stack

- **Frontend**:
  - React.js: For a dynamic and interactive user interface.
  - Tailwind CSS: For styling and responsiveness.
  - React Icons: Enhanced iconography for controls.
- **State Management**:
  - React Context API: Manages global state like the audio player.
  - Firebase Firestore: Stores user data, custom stations, and history.
- **Authentication**:
  - Firebase Authentication: Secure login with Google Auth.
- **Audio Streaming**:
  - Supports streaming via user-provided station URLs.
- **Image Upload**:
  - ImgBB API: Handles image uploads for station logos.

---

## 🚀 Getting Started

Follow these steps to set up the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/MandipKumarKanu/radio-station.git
cd nepali-radio-stations
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Firebase

- Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
- Enable Firebase Authentication with Google Auth and Firestore Database.
- Add Firebase credentials to `src/utils/firebase.config.js`.

### 4. Set Up ImgBB API

- Create an account at [ImgBB](https://imgbb.com/).
- Obtain an API key and add it to your environment configuration.

### 5. Start the Development Server

```bash
npm run dev
```

Visit the app at [http://localhost:5173](http://localhost:5173).

**Note**: To be an admin, you need to manually update your role in Firebase. Navigate to `users` collection > `yourUid` (document ID) > add or update the field `role` with the value `admin`.

---

## 📢 Adding Stations Publickly

Users can add custom stations via the `/addstations` page. The form requires:

- **Station Name**: Unique name of the radio station.
- **Stream URL**: URL for the station’s audio stream.
- **Frequency (Optional)**: Frequency of the station.
- **Address (Optional)**: Address where the station is located.
- **Province (Optional)**: Province where the station is located.
- **Logo (Optional)**: Upload station logos as files or provide an image URL via ImgBB.

### Public Station Management

Admins can manage public stations via the `/manage` page. This includes:

- **Adding Stations**: Fill in the form with station details and upload a logo.
- **Editing Stations**: Modify existing station details.
- **Deleting Stations**: Remove stations from the public list.

**Station Object Structure:**

```javascript
{
  id: "unique_station_id",
  name: "Radio Nepal",
  streamUrl: "https://stream1.radionepal.gov.np/live",
  logoUrl: "https://i.ibb.co/example.jpg",
  frequency: 100.0,
  address: "Kathmandu, Nepal",
  province: 3
}
```

---

## 🔄 Listening History

Your listening history is automatically tracked. Whenever you play a station, it gets added to your history. Access this feature from the app’s history section.

---

## 🌐 Live Demo

Try the live demo of this project:

[**Live Demo URL**](https://nep-tune.web.app/)

---

## 🤝 Contributing

We welcome contributions! Open pull requests or issues for:

- Bug fixes
- Feature requests
- Adding new stations

---

## 💬 Contact

For any questions or suggestions, feel free to reach out:

- **Email**: [mandipshah3@gmail.com](mailto:mandipshah3@gmail.com)
- **GitHub**: [@MandipKumarKanu](https://github.com/MandipKumarKanu)
