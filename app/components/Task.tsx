import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";

import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { TaskType } from "..";

// Interface defined for passing props from HomePage
interface TaskProps {
  item: TaskType;
  removeTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  renderRightActions: (id: string) => React.ReactNode;
}

function Task({
  item,
  removeTask,
  toggleTaskCompletion,
  renderRightActions,
}: TaskProps) {
  return (
    <ReanimatedSwipeable
      renderRightActions={() => renderRightActions(item.id)}
      onSwipeableOpen={() => removeTask(item.id)}
      testID={`swipeable-${item.description}`}
    >
      <View style={styles.taskContainer}>
        <Text style={styles.taskText}>{item.description}</Text>
        {/* <Text style={styles.taskText}>{item.category}</Text> */}

        <View style={styles.buttonsContainer}>
          <Pressable
            style={[styles.checkbox, item.completed && styles.checked]}
            onPress={() => toggleTaskCompletion(item.id)}
            testID={`checkbox-${item.description}`}
          >
            {item.completed && <Text style={styles.checkmark}>✔</Text>}
          </Pressable>
          <Pressable
            style={styles.deleteButton}
            onPress={() => removeTask(item.id)}
            testID={`delete-${item.description}`}
          >
            <Text style={styles.checkmark}>X</Text>
          </Pressable>
        </View>
      </View>
    </ReanimatedSwipeable>
  );
}

export default Task;

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 15,
    marginVertical: 10,
  },
  taskText: {
    fontSize: 18,
    maxWidth: 240,
    flexWrap: "wrap",
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderWidth: 2,
    backgroundColor: "red",
    borderColor: "#333",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: "#333",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checked: {
    backgroundColor: "#4CAF50",
  },
  checkmark: {
    color: "white",
    fontWeight: "bold",
  },
});
