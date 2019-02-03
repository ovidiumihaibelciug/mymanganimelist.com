export const loadState = () => {
  try {
    const serialisedState = localStorage.getItem('user');
    if (serialisedState === null) {
      return undefined;
    }
    return JSON.parse(serialisedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = user => {
  try {
    const serializedState = JSON.stringify(user);
    localStorage.setItem('user', serializedState);
  } catch (err) {
    return undefined;
  }
};
