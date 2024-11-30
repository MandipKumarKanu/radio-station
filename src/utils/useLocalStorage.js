function xorEncryptDecrypt(input, key) {
  let output = "";
  for (let i = 0; i < input.length; i++) {
    output += String.fromCharCode(
      input.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return output;
}

export function saveToLocalStorage(key, data, encryptionKey = "encryptionKey") {
  try {
    const dataStr = typeof data === "string" ? data : JSON.stringify(data);
    const encryptedData = xorEncryptDecrypt(dataStr, encryptionKey);
    localStorage.setItem(key, encryptedData);
  } catch (error) {
    console.error("Error saving data to localStorage:", error);
  }
}

export function getFromLocalStorage(key, encryptionKey = "encryptionKey") {
  try {
    const encryptedData = localStorage.getItem(key);
    if (encryptedData) {
      const decryptedData = xorEncryptDecrypt(encryptedData, encryptionKey);
      try {
        return JSON.parse(decryptedData);
      } catch (e) {
        return decryptedData;
      }
    }
    return null;
  } catch (error) {
    console.error("Error retrieving data from localStorage:", error);
    return null;
  }
}
