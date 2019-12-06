export const mockSessionStorage = (() => {
  let storage = {};
  return {
    getItem(key) {
      return storage[key];
    },
    removeItem(key) {
      delete storage[key];
    },
    setItem(key, value) {
      storage[key] = value.toString();
    },
    clear() {
      storage = {};
    },
    get length() {
      return Object.keys(storage).length;
    }
  };
})();
