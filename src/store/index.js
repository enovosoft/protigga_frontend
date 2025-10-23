import { createStore, StoreProvider } from "easy-peasy";
import studentStore from "./studentStore";

const store = createStore({ student: studentStore });

export { store, StoreProvider };
