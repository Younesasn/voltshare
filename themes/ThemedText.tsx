import { StyleSheet, Text, type TextProps } from 'react-native';

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    fontWeight: 'regular',
  },
  lilText: {
    fontSize: 12,
    fontWeight: 'regular',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  placeholder: {
    fontSize: 12,
    fontWeight: 'medium',
  },
});

type Props = TextProps & {
  variant?: keyof typeof styles;
  color?: string;
};

export function ThemedText({ variant, color, ...rest }: Props) {
  return <Text style={[styles[variant ?? 'text'], { color }]} {...rest} />;
};
