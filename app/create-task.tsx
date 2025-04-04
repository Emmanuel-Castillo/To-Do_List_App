import React from "react";
import { StyleSheet, View, TextInput, Button, Text, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import { CATEGORIES } from "./utils/categories";

// Defining type for tasks
export type TaskType = {
  id: string;
  description: string;
  category: string | null;
  reminder: Date | null;
  completed: boolean;
};

export default function CreateTaskScreen() {
  const [reminderTime, setReminderTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = ["Select Category", ...CATEGORIES];
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Task states for UI
  const [taskString, setTaskString] = useState<string>("");

  const router = useRouter();

  const changeSelectedCategory = (newCategory: string) => {
    if (newCategory !== categories[0]) setSelectedCategory(newCategory);
    else setSelectedCategory("");
  };


  // Sending a notification when a task has been created
  // As well as a scheduled notif if a task has a reminder set
  const sendNotification = async (task: TaskType) => {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Enable notifications to receive task alerts."
      );
      return;
    }

    // Immediate notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "New Task Added!",
        body: `Your task "${task.description}" has been created.`,
        sound: true,
      },
      trigger: null, // Show notification immediately
    });

    // Schedule the reminder (if reminder is not null)
    if (task.reminder) {
      const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Reminder!",
        body: `Your task "${task.description}" is due!`,
        sound: true,
      },
      trigger: {
        date: task.reminder,
        type: Notifications.SchedulableTriggerInputTypes.DATE,
      },
    });
    }
  };

  // Creates new task
  // Adds new task to tasks, then saves
  const addTask = async () => {
    console.log("here");
    // Only add task if newTask is not an empty string
    if (taskString.trim()) {
      const newTask: TaskType = {
        id: Date.now().toString(),
        description: taskString,
        category: selectedCategory.length > 0 ? selectedCategory : null,
        reminder: reminderTime,
        completed: false,
      };

      // Updating tasks in AsyncStorage
      const savedTasks = await AsyncStorage.getItem("tasks");
      const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];
      const newTasks = [...parsedTasks, newTask];
      saveTasks(newTasks);
      setTaskString("");

      // Create push notifications
      sendNotification(newTask);

      // Navigate back to App.tsx
      router.back();
    }
  };

  // Saves tasks to AsyncStorage
  const saveTasks = async (newTasks: TaskType[]) => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
    } catch (error) {
      console.error("Failed to save tasks: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter new task..."
        value={taskString}
        onChangeText={setTaskString}
        style={styles.input}
      />
      <View style={styles.inputContainer}>
        <Text>Set Reminder</Text>
        {reminderTime && <Text>Reminder Set: {reminderTime.toLocaleString()}</Text>}
        <Button title="Select Time" onPress={() => setShowDatePicker(true)} />
        {showDatePicker && (
          <DateTimePicker
            value={reminderTime ? reminderTime : new Date()}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              if (selectedTime) {
                setReminderTime(selectedTime);
                setShowDatePicker(false);
              }
            }}
          />
        )}
      </View>
      <View style={styles.inputContainer}>
        <Text>Select Category</Text>
        {selectedCategory && <Text>Cateogry: {selectedCategory}</Text>}
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => changeSelectedCategory(itemValue)}
          style={styles.pickerContainer}
        >
          {categories.map((category) => (
            <Picker.Item key={category} label={category} value={category} />
          ))}
        </Picker>
      </View>

      <Button title="Add Task" onPress={addTask} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginVertical: 12
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 5,
  },
  pickerContainer: {
    borderWidth: 2,
    backgroundColor: "lightgray",
  },
});
