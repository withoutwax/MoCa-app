import { View, Text, StyleSheet } from "react-native";

export default function ListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>List Screen</Text>
      <Text>This is where the list will go.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
