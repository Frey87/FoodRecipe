
import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Recipe({ categories, foods }) {
  const navigation = useNavigation();

  return (
    <View testID="recipesDisplay" style={styles.container}>
      <FlatList
        data={foods}
        numColumns={2}
        keyExtractor={(item) => item.recipeId}
        renderItem={({ item, index }) => (
          <ArticleCard
            item={item}
            index={index}
            navigation={navigation}
          />
        )}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No recipes found.
          </Text>
        }
      />
    </View>
  );
}

function ArticleCard({ item, index, navigation }) {
  return (
    <View testID="articleDisplay" style={styles.cardWrapper}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate("RecipeDetail", { item })
        }
      >
        <Image
          source={{ uri: item.recipeImage }}
          style={styles.recipeImage}
          resizeMode="cover"
        />

        <Text style={styles.recipeName} numberOfLines={2}>
          {item.recipeName}
        </Text>

        <Text
          style={styles.recipeDescription}
          numberOfLines={3}
        >
          {item.cookingDescription}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  cardWrapper: {
    width: "50%",
    padding: 6,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  recipeImage: {
    width: "100%",
    height: 140,
    borderRadius: 12,
  },
  recipeName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#27272A",
    marginTop: 10,
  },
  recipeDescription: {
    fontSize: 12,
    color: "#71717A",
    marginTop: 6,
    lineHeight: 18,
  },
  emptyText: {
    textAlign: "center",
    color: "#71717A",
    marginTop: 20,
  },
});
