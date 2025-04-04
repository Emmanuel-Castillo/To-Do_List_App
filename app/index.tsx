import App from "./components/App";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";

// This ensures notifications are handled correctly when the app is foregrounded.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function HomeScreen() {
  useEffect(() => {
    // Request permission for notifications
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission not granted!");
      }
    };

    // Set up listeners for incoming notifications
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("HELP Notification received:", notification);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("User responded to notification:", response);
        // For example, Navigate the user to the task
      });

    // Request notification permissions
    requestPermissions();

    return () => {
      // Clean up listeners when the component unmounts
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
      <App/>
  );
}
