import Tag from "@/components/Micro/Tag";
import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import React, { useState } from "react";
import { ScrollView, View, ViewStyle } from "react-native";

const Tags = () => {
  const { theme } = useTheme();
  const styles = madeStyles(theme);

  const [tags, setTags] = useState([
    { title: "All", selected: true },
    { title: "Technology", selected: false },
    { title: "Business", selected: false },
    { title: "Health", selected: false },
    { title: "Science", selected: false },
    { title: "Education", selected: false },
    { title: "Entertainment", selected: false },
    { title: "Sports", selected: false },
    { title: "Music", selected: false },
    { title: "News", selected: false },
    { title: "Comedy", selected: false },
    { title: "History", selected: false },
    { title: "Fiction", selected: false },
    { title: "True Crime", selected: false },
    { title: "Self-Help", selected: false },
    { title: "Society & Culture", selected: false },
  ]);

  const handleTagPress = (index: number) => {
    const updatedTags = tags.map((tag, i) => ({
      ...tag,
      selected: i === index,
    }));
    setTags(updatedTags);
  };

  return (
    <View style={styles.scrollContainer}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={styles.tags}
      >
        {tags.map((tag, index) => (
          <Tag
            key={index}
            title={tag.title}
            onPress={() => handleTagPress(index)}
            selected={tag.selected}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const madeStyles = makeStyles((theme) => ({
  tags: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.vw(2),
  } as ViewStyle,
  scrollContainer: {
    paddingLeft: theme.vw(4),
    paddingVertical: theme.vh(4),
  } as ViewStyle,
}));

export default Tags;
