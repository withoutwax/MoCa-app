import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import api from "../api/client";
import { Ionicons } from "@expo/vector-icons";

// Define the type for route params
type RouteParams = {
  cardId: number;
};

// Define the type for Card data
type Card = {
  id: number;
  imageUrl: string;
  name?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  company?: string;
  address?: string;
  status: string;
};

export default function DetailScreen() {
  const route = useRoute();
  // Safe access to params
  const { cardId } = (route.params as RouteParams) || {};

  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cardId) {
      fetchCard();
    }
  }, [cardId]);

  const fetchCard = async () => {
    try {
      // Assuming GET /cards/:id exists. If not, this will 404.
      // Since specific backend endpoints weren't fully detailed in prompt,
      // I'm assuming a standard REST pattern.
      const response = await api.get(`/cards/${cardId}`);
      setCard(response.data);
    } catch (error) {
      console.error("Failed to fetch card details", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="tomato" />
      </View>
    );
  }

  if (!card) {
    return (
      <View style={styles.center}>
        <Text>Card not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: card.imageUrl }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.name}>{card.name || "Unknown Name"}</Text>
        <Text style={styles.job}>{card.jobTitle}</Text>
        <Text style={styles.company}>{card.company}</Text>

        <View style={styles.divider} />

        <InfoRow icon="mail" text={card.email} />
        <InfoRow icon="call" text={card.phone} />
        <InfoRow icon="location" text={card.address} />

        <View style={styles.divider} />

        <Text style={styles.status}>Status: {card.status}</Text>
      </View>
    </ScrollView>
  );
}

function InfoRow({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text?: string;
}) {
  if (!text) return null;
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={20} color="gray" style={styles.icon} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  content: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  job: {
    fontSize: 18,
    color: "#666",
    marginTop: 5,
  },
  company: {
    fontSize: 16,
    color: "#888",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  icon: {
    marginRight: 15,
    width: 20,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#444",
  },
  status: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 10,
    textAlign: "right",
  },
});
