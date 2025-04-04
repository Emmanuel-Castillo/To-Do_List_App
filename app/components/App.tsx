import { StyleSheet, View, Button, FlatList, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Task from "./Task";
import { TaskType } from "../create-task";
import { useFocusEffect, useRouter } from "expo-router";
import { CATEGORIES } from "../utils/categories";

export default function App() {
  console.log(CATEGORIES)
  // Hardcoded category and filter array data
  const filters = ["All", ...CATEGORIES];

  // Task states for UI
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [filteredCategory, setFilteredCategory] = useState(filters[0]);

  const router = useRouter();

  // On app startup, load all tasks
  useEffect(() => {
    loadTasks();
  }, []);

  // When this screen is refocused, fetch tasks again (could be updated)
  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

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
  const saveTasks = async (newTasks: TaskType[]) => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
      setTasks(newTasks);
    } catch (error) {
      console.error("Failed to save tasks: ", error);
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
      if (filter === filters[0]) {
        loadTasks();
      } else {
        const savedTasks = await AsyncStorage.getItem("tasks");
        if (savedTasks) {
          const allTasks: TaskType[] = JSON.parse(savedTasks);
          const filteredTasks = allTasks.filter(
            (task) => task.category === filter
          );
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
        <Button
          title="Create New Task"
          onPress={() => router.push("/create-task")}
        />
        <Text style={{ marginTop: 24 }}>Select Filter</Text>
        <Picker
          selectedValue={filteredCategory}
          onValueChange={(newFilter) => filterTasks(newFilter)}
          style={styles.pickerContainer}
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
  },
  pickerContainer: {
    borderWidth: 2,
    backgroundColor: "lightgray",
  },
});
