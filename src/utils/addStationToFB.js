import { RadioList } from "../../public/assets/radio_list.js";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { db } from "./firebase.config.js";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function addRadioStation(station) {
  try {
    await setDoc(doc(collection(db, "stations"), station.id), {
      id: station.id,
      name: station.name || "",
      streamUrl: station.streamUrl || "",
      frequency: station.frequency || "",
      address: station.address || "",
      province: station.province || "",
      hits: 0,
    });
    console.log(`Added station: ${station.name}`);
  } catch (error) {
    console.error(`Error adding station: ${station.name}`, error);
  }
}

export async function addAllStations() {
  for (let i = 0; i < RadioList.length; i++) {
    await addRadioStation(RadioList[i]);
    await delay(500);
  }
}

addAllStations().then(() => {
  console.log("All stations have been added!");
  process.exit();
});
