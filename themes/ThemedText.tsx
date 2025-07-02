import { StyleSheet, Text, type TextProps } from "react-native";

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    fontWeight: "regular",
  },
  lilText: {
    fontSize: 12,
    fontWeight: "regular",
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
  },
  placeholder: {
    fontSize: 12,
    fontWeight: "medium",
  },
});

type Props = TextProps & {
  variant?: keyof typeof styles;
  color?: string;
  isCenter?: boolean;
};

export function ThemedText({ variant, color, isCenter, ...rest }: Props) {
  return (
    <Text
      style={[
        styles[variant ?? "text"],
        isCenter ? { textAlign: "center" } : null,
        { color, fontFamily: "Uber" },
      ]}
      {...rest}
    />
  );
}
