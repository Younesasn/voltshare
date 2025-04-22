import { Colors } from "@/themes/Colors";
import { ThemedText } from "@/themes/ThemedText";
import { View, TouchableOpacity, StyleSheet } from "react-native";

export default function DayButton({
  letterDay,
  numberDay,
  index,
  selectedId,
  onPress,
}: {
  letterDay: string;
  numberDay: number;
  index: number;
  selectedId?: number;
  onPress?: (index: number) => void;
}) {
  const isSelected = selectedId === index;

  return (
    <View style={styles.day}>
      <ThemedText variant="lilText">{letterDay}</ThemedText>
      <TouchableOpacity
        onPress={() => onPress && onPress(index)}
        style={[
          styles.dayButton,
          {
            backgroundColor: isSelected
              ? Colors["shady-950"]
              : Colors["shady-50"],
          },
        ]}
      >
        <ThemedText
          variant="lilText"
          color={isSelected ? "white" : Colors["shady-900"]}
        >
          {numberDay}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  day: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16, // pas ouf mais obligé
    gap: 10,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors["shady-50"],
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors["shady-300"],
    borderWidth: 1,
  },
});
