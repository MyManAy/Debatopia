import { StyleSheet } from "react-native";

import { useCallback, useEffect, useState } from "react";
import Colors from "../../constants/Colors";
import { clientSupabase } from "../../supabase/clientSupabase";
import { useLocalSearchParams } from "expo-router";
import { GiftedChat, IMessage } from "react-native-gifted-chat";

export default function TabOneScreen() {
  const { threadId } = useLocalSearchParams();
  const [messageList, setMessageList] = useState([] as IMessage[]);

  useEffect(() => {
    (async () => {
      const { data } = await clientSupabase
        .from("Message")
        .select()
        .eq("threadId", threadId)
        .order("created_at", { ascending: false });
      setMessageList(
        data!.map((item) => ({
          _id: item.id,
          text: item.content,
          createdAt: new Date(item.created_at),
          user: {
            // replace with actual user
            _id: 2,
            name: "Default",
            avatar:
              "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
          },
        }))
      );
    })();

    const realtimeMessages = clientSupabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `threadId=eq.${threadId}`,
        },
        ({ new: data }) => {
          setMessageList((messages) => [
            {
              _id: data.id,
              text: data.content,
              createdAt: new Date(data.created_at),
              user: {
                // replace with actual user
                _id: 2,
                name: "Default",
                avatar:
                  "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
              },
            },
            ...messages,
          ]);
        }
      )
      .subscribe();

    return () => {
      clientSupabase.removeChannel(realtimeMessages);
    };
  }, []);

  const onSend = useCallback((messages: IMessage[]) => {
    setMessageList((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <GiftedChat
      messages={messageList}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
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
