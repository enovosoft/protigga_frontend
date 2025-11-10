import { createStore, StoreProvider } from "easy-peasy";
import adminStore from "./adminStore";
import studentStore from "./studentStore";

const store = createStore({
  student: studentStore,
  admin: adminStore,
});

export { store, StoreProvider };
