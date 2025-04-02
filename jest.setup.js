import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

// For unit testing
jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

jest.mock('react-native-gesture-handler', () => {
    return {
      GestureHandlerRootView: ({ children }) => children,
      Swipeable: jest.fn(),
      PanGestureHandler: jest.fn(),
      State: {},
    };
  });
  