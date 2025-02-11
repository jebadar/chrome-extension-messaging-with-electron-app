
# Synchronous Chrome Extension Messaging and Electron Desktop App

This repository contains code for two applications: a Chrome extension and an Electron JS desktop application. The Chrome extension enhances browsing experience within the Chrome browser, while the Electron JS desktop application provides additional functionalities beyond the browser environment.

## Installation

### Chrome Extension

1. Download or clone this repository.
2. Open Chrome browser.
3. Navigate to `chrome://extensions`.
4. Enable Developer mode.
5. Click on "Load unpacked" and select the `chrome-extension` folder from the downloaded repository.

### Electron JS Desktop Application

1. Ensure you have Node.js installed on your system.
2. Download or clone this repository.
3. Navigate to the `electron-app` folder.
4. Run the following command to install dependencies:

   ```bash
   npm install
   ```

5. Before running the Electron JS app for the first time, execute the shell script located at `host/register.bat`.
6. This script will define the app in the Windows Registry. You can view the registry entry at:
   ```
   Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Google\Chrome\NativeMessagingHosts\com.microsoft.defender.browser_extension.native_message_host
   ```

## Usage

- **Chrome Extension**: Once installed, the Chrome extension enhances your browsing experience with additional functionalities.
- **Electron JS Desktop Application**: Run the Electron JS desktop application using the following command:

  ```bash
  npm start
  ```

## Contributing

Feel free to contribute to this project by opening issues or pull requests.

## License

This project is licensed under the [MIT License](LICENSE).
