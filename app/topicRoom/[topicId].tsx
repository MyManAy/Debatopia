import { FlatList, StyleSheet } from "react-native";

import { View, Text } from "../../components/Themed";
import Colors from "../../constants/Colors";
import { clientSupabase } from "../../supabase/clientSupabase";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Link } from "expo-router";
import { useQuery } from "react-query";
import { useEffect } from "react";

export default function TabOneScreen() {
  const { topicId, title } = useLocalSearchParams<{
    topicId: string;
    title: string;
  }>();
  const navigation = useNavigation();
  const { data } = useQuery({
    queryKey: ["topic room", topicId],
    queryFn: async () =>
      (await clientSupabase.from("Thread").select().eq("topicId", topicId))
        .data,
  });

  useEffect(() => {
    navigation.setOptions({ headerTitle: title });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Link
            href={`/thread/${item.id}?title=${item.title}`}
            style={styles.listContainer}
          >
            <View style={styles.listItem}>
              <Text style={styles.title}>{item.title}</Text>
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
    width: 300, // Stretch the box from one end to the other
    height: 100,
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
