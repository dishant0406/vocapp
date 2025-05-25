import Tag from "@/components/Micro/Tag";
import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import { Topic } from "@/utils/types/podcast";
import React, { useEffect, useState } from "react";
import { ScrollView, View, ViewStyle } from "react-native";

type TagsProps = {
  topics?: Topic[];
};

const Tags = ({ topics }: TagsProps) => {
  const { theme } = useTheme();
  const styles = madeStyles(theme);

  const [tags, setTags] = useState<{ title: string; selected: boolean }[]>([]);

  useEffect(() => {
    if (topics && topics.length > 0) {
      const initialTags = topics.map((topic, index) => ({
        title: topic.name,
        selected: false, // Select the first topic by default
      }));
      setTags([{ title: "All", selected: true }, ...initialTags]);
    } else {
      setTags([]);
    }
  }, [topics]);

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
    paddingTop: theme.vh(2),
  } as ViewStyle,
}));

export default Tags;
