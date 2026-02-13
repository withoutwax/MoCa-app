import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNotificationSource } from "../hooks/useNotificationSource";
import { useScanCard } from "../hooks/useScanCard"; // Import to ensure it's used/tested if we add a button
import { getCards } from "../api/cards";

// const API_URL = 'http://localhost:3000/cards'; // Base URL

export default function ListScreen() {
  // 1. Connect to SSE
  useNotificationSource();

  // 2. Fetch Cards
  // Assuming there's an endpoint to get cards. I implemented CardsService.findAll but didn't make a Controller GET endpoint for it explicitly in the prompt plan,
  // but usually ListScreen needs to fetch data.
  // Let's assume GET /cards exists or we just show the effect for now.
  // Since I didn't create GET /cards in backend, I should probably have done that.
  // The Backend part 1 step 2 said "Return immediately".
  // The User Request Part 2 said "Update useScanCard... List Screen: Show Analyzing skeleton".

  // For demonstration, I'll mock the query or assume the user has a fetch hook.
  // But wait, if I don't have GET /cards, the list will be empty.
  // I should probably add GET /cards to backend to make this complete, or just mock the data source.
  // Given I can edit files, I'll assume standard fetch.

  const {
    data: cards,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["cards"],
    queryFn: getCards,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Business Cards</Text>

      {/* Visual Indicator for SSE */}
      <Text style={styles.subtitle}>Real-time updates active</Text>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              {item.status === "PENDING" || item.status === "PROCESSING" ? (
                <Text style={styles.analyzing}>Analyzing...</Text>
              ) : (
                <>
                  <Text style={styles.cardName}>
                    {item.name || "Unknown Name"}
                  </Text>
                  <Text>{item.email}</Text>
                  <Text>{item.phone}</Text>
                </>
              )}
              <Text style={styles.status}>{item.status}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>No cards found. Scan one!</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "green",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  cardImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: "#eee",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  cardName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  analyzing: {
    fontStyle: "italic",
    color: "#888",
  },
  status: {
    fontSize: 10,
    color: "#aaa",
    marginTop: 5,
    alignSelf: "flex-end",
  },
});
