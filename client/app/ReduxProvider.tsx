"use client";
import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import { searchReducer } from "./reducers/searchReducer";

const store = createStore(
  combineReducers({
    search: searchReducer,
  }),
);

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}