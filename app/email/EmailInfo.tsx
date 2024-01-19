import { ImageSourcePropType, View, Image } from "react-native";
import { Text } from "../../components/Themed";

interface Props {
  header: string;
  imageSrc: ImageSourcePropType;
  description: string;
}
export default function EmailInfo({ header, imageSrc, description }: Props) {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.innerContainer}>
        <Text style={styles.header}>{header}</Text>
        <Image
          width={100}
          height={100}
          source={imageSrc}
          alt={"Email"}
          resizeMode={"cover"}
        />
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = {
  mainContainer: {
    display: "flex",
    padding: 60,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: "100%",
  },
  innerContainer: {
    display: "flex",
    position: "relative",
    flexDirection: "column",
    gap: 100,
    alignItems: "center",
  },
  header: {
    fontSize: 80,
    lineHeight: 1,
    fontWeight: "600",
    color: "#000000",
  },
  description: {
    fontSize: 60,
    lineHeight: 0.75,
    fontWeight: "500",
    color: "#000000",
  },
} as const;
