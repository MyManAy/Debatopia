import { View } from "react-native";
import { StyleSheet } from "react-native";
import Timer from "./Timer";
import GradeButton from "./GradeButton";
import { DBTableTypeFinder } from "../supabase/dbTableTypeFinder";

type Props = {
  threadId: number;
  title: string;
  disabled: boolean;
  messages: Omit<DBTableTypeFinder<"Message">, "threadId" | "created_at">[];
};

const ThreadHeaderRight = ({ threadId, title, disabled, messages }: Props) => {
  return (
    <View style={styles.container}>
      <Timer timeRemaining={300_000} />
      <GradeButton
        title={title}
        threadId={threadId}
        disabled={disabled}
        messages={messages}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 30,
  },
});
export default ThreadHeaderRight;
