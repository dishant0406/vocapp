import Tag from "@/components/Micro/Tag";
import { makeStyles } from "@/utils/theme/makeStyles";
import { useTheme } from "@/utils/theme/useTheme";
import React, { useEffect, useState } from "react";
import { ScrollView, View, ViewStyle } from "react-native";

type TagItem = {
  id: string | number;
  value: string;
};

type TagsProps = {
  items?: TagItem[];
  selected?: string | number | null;
  setSelected?: (id: string | number | null) => void;
  includeAllOption?: boolean;
  tagStyle?: ViewStyle;
};

const Tags = ({
  items = [],
  selected = null,
  setSelected,
  includeAllOption = true,
  tagStyle = {},
}: TagsProps) => {
  const { theme } = useTheme();
  const styles = madeStyles(theme);

  const [tags, setTags] = useState<
    { id: string | number; value: string; selected: boolean }[]
  >([]);

  useEffect(() => {
    if (items.length > 0) {
      const initialTags = items.map((item) => ({
        id: item.id,
        value: item.value,
        selected: item.id === selected,
      }));

      if (includeAllOption) {
        setTags([
          {
            id: "all",
            value: "All",
            selected: selected === null || selected === "all",
          },
          ...initialTags,
        ]);
      } else {
        setTags(initialTags);
      }
    } else {
      setTags([]);
    }
  }, [items, selected, includeAllOption]);

  const handleTagPress = (index: number) => {
    const selectedTag = tags[index];

    if (setSelected) {
      const newSelectedId = selectedTag.id === "all" ? null : selectedTag.id;
      setSelected(newSelectedId);
    } else {
      // Fallback to internal state management if no setSelected prop
      const updatedTags = tags.map((tag, i) => ({
        ...tag,
        selected: i === index,
      }));
      setTags(updatedTags);
    }
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
            style={{ ...tagStyle }}
            key={tag.id.toString()}
            title={tag.value}
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
    paddingBottom: theme.vh(4),
  } as ViewStyle,
}));

export default Tags;
