import { FlatList, StyleSheet } from "react-native";

import { View, Text } from "../../components/Themed";
import { useEffect, useState } from "react";
import Colors from "../../constants/Colors";
import { clientSupabase } from "../../supabase/clientSupabase";
import { DBTableTypeFinder } from "../../supabase/dbTableTypeFinder";
import { Link } from "expo-router";

export default function TabOneScreen() {
  const [topicList, setTopicList] = useState(
    [] as DBTableTypeFinder<"TopicRoom">[]
  );

  useEffect(() => {
    (async () => {
      const { data } = await clientSupabase.from("TopicRoom").select();
      setTopicList(data!);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={topicList}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Link href={`/topicRoom/${item.id}`}>
              <Text style={styles.title}>{item.topic}</Text>
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
    fontSize: 25,
    fontWeight: "bold",
    alignItems: "center",
    textAlign: "center",
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
    backgroundColor: Colors.light.tabIconDefault, // You can use any color you like
    padding: 20, // Increase padding for a wider appearance
    borderRadius: 8,
    marginVertical: 10,
    width: 300, // Stretch the box from one end to the other
    height: 100,
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
