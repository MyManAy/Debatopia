import { FlatList, Platform, StyleSheet } from "react-native";

import { View, Text } from "../../components/Themed";
import Colors from "../../constants/Colors";
import { clientSupabase } from "../../supabase/clientSupabase";
import { Link } from "expo-router";
import { useQuery } from "react-query";
import { useNavigation } from "expo-router";
import { useEffect } from "react";

export default function TabOneScreen() {
  const { data } = useQuery({
    queryKey: "topic list",
    queryFn: async () => (await clientSupabase.from("TopicRoom").select()).data,
  });

  const navigation = useNavigation();

  useEffect(() => {
    if (Platform.OS === "web") {
      document.title = "Lume Debate";
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Link
            href={`/topicRoom/${item.id}?title=${item.topic}`}
            style={styles.listContainer}
          >
            <View style={styles.listItem}>
              <Text style={styles.title}>{item.topic}</Text>
            </View>
          </Link>
        )}
        style={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    maxWidth: 250,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "100%",
  },
  listContainer: {
    marginTop: 20,
  },
  listItem: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.tabIconDefault, // You can use any color you like
    borderRadius: 8,
    height: 100,
    width: 300,
  },
  listItemText: {
    fontSize: 26,
    color: "black",
  },
  roundedSquare: {
    backgroundColor: Colors.light.tint, // You can use any color you like
    height: 50,
    width: "100%",
    borderRadius: 10,
    marginTop: 20,
  },
});
