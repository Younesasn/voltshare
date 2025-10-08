import * as Location from "expo-location";

export const getPosition = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    return;
  }
  return await Location.getCurrentPositionAsync();
};
