import {
  StyleSheet,
  View,
  TextInput,
  Button,
  FlatList,
  Text,
} from "react-native";

import { Picker } from "@react-native-picker/picker";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Task from "./components/Task";

// Defining type for tasks
export type TaskType = {
  id: string;
  description: string;
  category: string;
  completed: boolean;
};

export default function HomeScreen() {
  // Hardcoded category and filter array data
  const categories = ["Work", "Personal", "Shopping"];
  const filters = ["All", ...categories];

  // Task states for UI
  const [taskString, setTaskString] = useState<string>("");
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [filteredCategory, setFilteredCategory] = useState(filters[0]);

  // On app startup, load all tasks
  useEffect(() => {
    loadTasks();
  }, []);

  // Loading tasks saved from AsyncStorage
  // Sets tasks state when received
  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem("tasks");
      if (savedTasks) setTasks(JSON.parse(savedTasks));
    } catch (error) {
      console.error("Failed to load tasks: ", error);
    }
  };

  // Saves tasks to AsyncStorage
  // Sets tasks when saved
  const saveTasks = async (newTasks: TaskType[]) => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
      setTasks(newTasks);
    } catch (error) {
      console.error("Failed to save tasks: ", error);
    }
  };

  // Creates new task
  // Adds new task to tasks, then saves
  const addTask = () => {
    // Only add task if newTask is not an empty string
    if (taskString.trim()) {
      const newTask: TaskType = {
        id: Date.now().toString(),
        description: taskString,
        category: selectedCategory,
        completed: false,
      };
      const newTasks = [...tasks, newTask];
      saveTasks(newTasks);
      setTaskString("");
    }
  };

  // Removes task by id from tasks, then saves
  const removeTask = (id: string) => {
    const newTasks = tasks.filter((task) => task.id != id);
    saveTasks(newTasks);
  };

  // Toggles completiong of task given id
  // Creates updated tasks, then saves
  const toggleTaskCompletion = (id: string) => {
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks(newTasks);
  };

  // Swiping task to the left with render the view on the right
  const renderRightActions = (id: string) => {
    return (
      <View style={styles.deleteContainer}>
        <Text style={styles.deleteText}>Delete</Text>
      </View>
    );
  };

  // Filtered tasks based on categories
  const filterTasks = async (filter: string) => {
    try {
      setFilteredCategory(filter);

      // If "All is selected", reload all tasks from AsyncStorage
      if (filter === categories[0]) { 
        loadTasks();
      } else {
        const savedTasks = await AsyncStorage.getItem("tasks");
        if (savedTasks) {
          const allTasks: TaskType[] = JSON.parse(savedTasks);
          const filteredTasks = allTasks.filter((task) => task.category === filter);
          setTasks(filteredTasks);
        }
      }
    } catch (error) {
      console.error("Failed to filter tasks: ", error);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View>
        <TextInput
          placeholder="Enter new task..."
          value={taskString}
          onChangeText={setTaskString}
          style={styles.input}
        />
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        >
          {categories.map((category) => (
            <Picker.Item key={category} label={category} value={category} />
          ))}
        </Picker>
        <Button title="Add Task" onPress={addTask} />
        <Picker
          selectedValue={filteredCategory}
          onValueChange={(newFilter) => filterTasks(newFilter)}
        >
          {filters.map((filter) => (
            <Picker.Item key={filter} label={filter} value={filter} />
          ))}
        </Picker>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Task
             item={item}
             removeTask={removeTask}
             renderRightActions={renderRightActions}
             toggleTaskCompletion={toggleTaskCompletion}
            />
          )}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 5,
  },
  deleteContainer: {
    backgroundColor: "red",
    padding: 15,
    marginVertical: 10,
    justifyContent: "center",
  },
  deleteText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  }
});
