import { useEffect, useState } from "react";
import { clientSupabase } from "../../supabase/clientSupabase";
import { useLocalSearchParams, useNavigation } from "expo-router";

import {
  Composer,
  ComposerProps,
  GiftedChat,
  IMessage,
  SendProps,
} from "react-native-gifted-chat";
import { DBTableTypeFinder } from "../../supabase/dbTableTypeFinder";
import { useQuery } from "react-query";
import { Platform } from "react-native";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import ThreadHeaderRight from "../../components/threadHeaderRight";

export default function TabOneScreen() {
  const { threadId, title } = useLocalSearchParams<{
    threadId: string;
    title: string;
  }>();
  const [messageList, setMessageList] = useState([] as IMessage[]);
  const navigation = useNavigation();
  const [isGraded, setIsGraded] = useState(false);

  const createSummaryMessage = (
    grading: DBTableTypeFinder<"Grading">,
    usernameData: { id: string; username: string }[],
    messageList: IMessage[]
  ) => {
    const winnerUsername =
      usernameData[
        usernameData.findIndex((item) => item.id === grading.winnerId)
      ].username;
    const loserUsername =
      usernameData[
        usernameData.findIndex((item) => item.id === grading.loserId)
      ].username;

    const winnerBestMessage =
      messageList[
        messageList.findIndex(
          (item) => Number(item._id) === grading.winnerMessageId
        )
      ].text;
    const loserBestMessage =
      messageList[
        messageList.findIndex(
          (item) => Number(item._id) === grading.loserMessageId
        )
      ].text;

    const winnerHeadline = `The winner is: ${winnerUsername}`;

    const reasoning = grading.summary.split(". ").join(".\n").trim();

    const winnerHighlight = `${winnerUsername}'s best message was: \"${winnerBestMessage}\"`;
    const winnerStats = `Here how ${winnerUsername} was graded:
    Argumentation: ${grading.argScoreWinner}
    Evidence: ${grading.evidScoreWinner}
    Counter Arguments: ${grading.cargScoreWinner}`;

    const loserhighlight = `${loserUsername}'s best message was: \"${loserBestMessage}\"`;
    const loserStats = `Here how ${loserUsername} was graded:
    Argumentation: ${grading.argScoreLoser}
    Evidence: ${grading.evidScoreLoser}
    Counter Arguments: ${grading.cargScoreLoser}`;

    return [
      reasoning,
      winnerHeadline,
      [winnerHighlight, winnerStats].join("\n\n"),
      [loserhighlight, loserStats].join("\n\n"),
    ].join("\n\n\n");
  };

  useQuery({
    queryKey: ["thread", threadId],
    queryFn: async () => {
      const msgs = (
        await clientSupabase
          .from("Message")
          .select("*, User (username)")
          .eq("threadId", threadId)
          .order("created_at", { ascending: false })
      ).data!.map((item) => generateMessage(item));
      setMessageList(msgs);
    },
    onSuccess: async () => {
      const grading = (
        await clientSupabase
          .from("Grading")
          .select()
          .eq("threadId", threadId)
          .maybeSingle()
      ).data;

      if (grading) {
        setIsGraded(true);

        const usernameData = (
          await clientSupabase
            .from("User")
            .select("username, id")
            .in("id", [grading.winnerId, grading.loserId])
        ).data!;

        setMessageList((msgs) => [
          {
            _id: -99,
            text: createSummaryMessage(grading, usernameData, msgs),
            createdAt: new Date(grading.created_at),

            user: {
              _id: -99,
              name: "Lume Judge",
              // replace when profile upload functionality
              avatar: "https://static.thenounproject.com/png/1076388-200.png",
            },
          },
          ...msgs,
        ]);
      }
    },
  });

  const { data: userId } = useQuery({
    queryKey: "user",
    queryFn: async () => (await clientSupabase.auth.getUser()).data.user!.id,
  });
  const generateMessage = (
    data: DBTableTypeFinder<"Message"> & { User: { username?: string } | null }
  ) => {
    return {
      _id: data.id,
      text: data.content,
      createdAt: new Date(data.created_at),
      user: {
        _id: data.userId,
        name: data.User?.username ?? "Unknown",
        // replace when profile upload functionality
        avatar:
          "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
      },
    };
  };

  const generateGradingMessage = (data: IMessage) => ({
    id: Number(data._id),
    content: data.text,
    userId: data.user._id.toString(),
  });

  useEffect(() => {
    const realtimeMessages = clientSupabase
      .channel(`thread${threadId}user${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `threadId=eq.${threadId}`,
        },
        async ({ new: newMessage }: { new: DBTableTypeFinder<"Message"> }) => {
          const { data: senderData } = await clientSupabase
            .from("User")
            .select("username")
            .eq("id", newMessage.userId)
            .single();
          setMessageList((messages) => [
            generateMessage({
              ...newMessage,
              User: { username: senderData?.username },
            }),
            ...messages,
          ]);
        }
      )
      .subscribe();

    return () => {
      clientSupabase.removeChannel(realtimeMessages);
    };
  }, []);

  useEffect(() => {
    if (messageList) {
      navigation.setOptions({
        headerTitle: title,
        headerRight: () => (
          <ThreadHeaderRight
            threadId={Number(threadId)}
            title={title}
            disabled={isGraded}
            messages={messageList.map((item) => generateGradingMessage(item))}
          />
        ),
      } as NativeStackNavigationOptions);
    }
  }, [messageList]);

  const onSend = async (messages: IMessage[]) => {
    const lastMessage = messages[0];

    await clientSupabase.from("Message").insert({
      content: lastMessage!.text,
      threadId: Number(threadId),
      userId: userId!,
    });
  };

  const CustomComposer = (
    props: ComposerProps & {
      // GiftedChat passes its props to all of its `render*()`
      onSend: SendProps<IMessage>["onSend"];
      text: SendProps<IMessage>["text"];
    }
  ) => (
    <Composer
      {...props}
      textInputProps={{
        ...props.textInputProps,
        // for enabling the Return key to send a message only on web
        blurOnSubmit: Platform.OS === "web",
        onSubmitEditing:
          Platform.OS === "web"
            ? () => {
                if (props.text && props.onSend) {
                  props.onSend({ text: props.text.trim() }, true);
                }
              }
            : undefined,
      }}
    />
  );

  return (
    <GiftedChat
      messages={messageList}
      onSend={onSend}
      disableComposer={!userId || isGraded}
      user={{
        _id: userId ?? -1,
      }}
      renderComposer={CustomComposer}
      keyboardShouldPersistTaps="never"
      renderUsernameOnMessage
      placeholder={
        isGraded ? "This chat has already been graded" : "Type a message..."
      }
    />
  );
}
