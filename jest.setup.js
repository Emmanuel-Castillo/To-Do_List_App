import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

// For unit testing
jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);
  