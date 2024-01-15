import { StyleSheet } from "react-native";

import { useEffect, useState } from "react";
import Colors from "../../constants/Colors";
import { clientSupabase } from "../../supabase/clientSupabase";
import { useLocalSearchParams } from "expo-router";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { DBTableTypeFinder } from "../../supabase/dbTableTypeFinder";

export default function TabOneScreen() {
  const { threadId }: { threadId: string } = useLocalSearchParams();
  const [messageList, setMessageList] = useState([] as IMessage[]);
  const [currentUserId, setCurrentUserId] = useState(null as string | null);

  const generateMessage = (
    data: DBTableTypeFinder<"Message"> & { User: { username: string } }
  ) => ({
    _id: data.id,
    text: data.content,
    createdAt: new Date(data.created_at),
    user: {
      // replace with actual user
      _id: data.userId,
      name: data.User?.username ?? "Loading",
      avatar:
        "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
    },
  });

  useEffect(() => {
    (async () => {
      setCurrentUserId((await clientSupabase.auth.getUser()).data.user!.id);

      const { data } = await clientSupabase
        .from("Message")
        .select(`*, User (username)`)
        .eq("threadId", threadId)
        .order("created_at", { ascending: false });
      setMessageList(data!.map((item: any) => generateMessage(item)));
    })();

    const realtimeMessages = clientSupabase
      .channel(`thread${threadId}user${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `threadId=eq.${threadId}`,
        },
        ({ new: data }) => {
          // if (data.userId !== currentUserId) {
          // }
          setMessageList((messages) => [
            generateMessage(data as any),
            ...messages,
          ]);
        }
      )
      .subscribe();

    return () => {
      clientSupabase.removeChannel(realtimeMessages);
    };
  }, []);

  const onSend = async (messages: IMessage[]) => {
    const lastMessage = messages[0];
    console.log(lastMessage);

    // setMessageList((previousMessages) =>
    //   GiftedChat.append(previousMessages, messages)
    // );

    await clientSupabase.from("Message").insert({
      content: lastMessage!.text,
      threadId: Number(threadId),
      userId: currentUserId!,
    });
  };

  // const ChatComposer = (
  //   props: ComposerProps & {
  //     onSend: SendProps<IMessage>["onSend"];
  //     text: SendProps<IMessage>["text"];
  //   }
  // ) => {
  //   return (
  //     <Composer
  //       {...props}

  //       textInputProps={{
  //         ...props.textInputProps,
  //         blurOnSubmit: false,
  //         multiline: false,
  //         onSubmitEditing: () => {
  //           if (props.text && props.onSend) {
  //             props.onSend({ text: props.text.trim() }, true);
  //           }
  //         },
  //       }}
  //     />
  //   );
  // };

  return (
    <GiftedChat
      messages={messageList}
      onSend={onSend}
      user={{
        _id: currentUserId ?? 1,
      }}
      keyboardShouldPersistTaps="never"
      renderUsernameOnMessage
      // renderComposer={ChatComposer}
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
  listContainer: {},
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
