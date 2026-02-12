import { View, Text, Button, StyleSheet } from "react-native";
import { useAuthStore } from "../store/useAuthStore";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{user?.name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email}</Text>

        <Text style={styles.label}>Account Type:</Text>
        <Text style={styles.value}>{user?.accountType}</Text>
      </View>

      <Button title="Logout" onPress={logout} color="#FF3B30" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  infoContainer: {
    width: "100%",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 5,
  },
});
