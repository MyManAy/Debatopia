import { FlatList, StyleSheet } from "react-native";

import { View, Text } from "../../components/Themed";
import { useEffect, useState } from "react";
import Colors from "../../constants/Colors";
import { clientSupabase } from "../../supabase/clientSupabase";
import { DBTableTypeFinder } from "../../supabase/dbTableTypeFinder";
import { useLocalSearchParams } from "expo-router";
import { Link } from "expo-router";

export default function TabOneScreen() {
  const [threadList, setThreadList] = useState(
    [] as DBTableTypeFinder<"Thread">[]
  );
  const { topicRoomId } = useLocalSearchParams();

  useEffect(() => {
    (async () => {
      const { data } = await clientSupabase
        .from("Thread")
        .select()
        .eq("topicId", topicRoomId);
      setThreadList(data!);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={threadList}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Link href={`/thread/${item.id}`}>
              <Text>{item.title}</Text>
            </Link>
          </View>
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
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center",
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
    justifyContent: "space-around",
    backgroundColor: Colors.light.background, // You can use any color you like
    padding: 20, // Increase padding for a wider appearance
    borderRadius: 8,
    marginVertical: 10,
    width: "100%", // Stretch the box from one end to the other
  },
  listItemText: {
    fontSize: 16,
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
