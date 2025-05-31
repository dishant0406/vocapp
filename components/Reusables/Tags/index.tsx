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
  selected?: string | number | (string | number)[] | null; // Modified
  setSelected?: (
    selection: string | number | (string | number)[] | null
  ) => void; // Modified
  includeAllOption?: boolean;
  tagStyle?: ViewStyle;
  isMultiSelect?: boolean; // Added
};

const Tags = ({
  items = [],
  selected = null,
  setSelected,
  includeAllOption = true,
  tagStyle = {},
  isMultiSelect = false, // Added default
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
        selected: isMultiSelect
          ? Array.isArray(selected) && selected.includes(item.id)
          : item.id === selected,
      }));

      if (includeAllOption) {
        setTags([
          {
            id: "all",
            value: "All",
            selected: isMultiSelect
              ? selected === null ||
                (Array.isArray(selected) && selected.length === 0)
              : selected === null || selected === "all",
          },
          ...initialTags,
        ]);
      } else {
        setTags(initialTags);
      }
    } else {
      setTags([]);
    }
  }, [items, selected, includeAllOption, isMultiSelect]); // Added isMultiSelect to dependency array

  const handleTagPress = (index: number) => {
    const pressedTag = tags[index];

    if (setSelected) {
      if (isMultiSelect) {
        if (pressedTag.id === "all") {
          setSelected(null); // "All" selected, pass null
        } else {
          let currentSelectedArray: (string | number)[] = [];
          // Initialize currentSelectedArray from selected prop, filtering out "all" if present
          if (Array.isArray(selected)) {
            currentSelectedArray = selected.filter((id) => id !== "all");
          }
          // if selected is not an array but also not null, it implies a single selection previously.
          // For multi-select, we transition it to an array.
          // However, this scenario should ideally be handled by ensuring `selected` prop type matches `isMultiSelect` mode.
          // The effect hook already correctly initializes tags based on `selected` prop.

          const tagIdIndex = currentSelectedArray.indexOf(pressedTag.id);

          if (tagIdIndex > -1) {
            // Tag was already selected
            currentSelectedArray.splice(tagIdIndex, 1); // Deselect
          } else {
            // Tag was not selected
            currentSelectedArray.push(pressedTag.id); // Select
          }

          // If after modification, the array is empty and "All" option is available, select "All"
          if (currentSelectedArray.length === 0 && includeAllOption) {
            setSelected(null);
          } else {
            setSelected(currentSelectedArray);
          }
        }
      } else {
        // Single select mode
        const newSelectedId = pressedTag.id === "all" ? null : pressedTag.id;
        setSelected(newSelectedId);
      }
    } else {
      // Fallback to internal state management if no setSelected prop
      // This part is for single-select by index and would need significant changes
      // to support multi-select internal state. Assuming setSelected will be provided
      // for the new multi-select use cases as per the prompt.
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
