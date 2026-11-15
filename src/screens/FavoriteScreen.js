
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
import { useSelector } from "react-redux";

export default function FavoriteScreen() {
  const navigation = useNavigation();

  // Отримуємо обрані рецепти з Redux
  const favoriteRecipesList = useSelector(
    (state) => state.favorites.favoriterecipes
  ) ?? [];

  // Скорочення довгих назв рецептів
  const truncateTitle = (title = "") => {
    return title.length > 20
      ? title.substring(0, 20) + "..."
      : title;
  };

  // Картка рецепта
  const renderRecipe = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() =>
        navigation.navigate("RecipeDetail", item)
      }
      testID="favoriteRecipeCard"
    >
      <Image
        source={{ uri: item.recipeImage }}
        style={styles.recipeImage}
        resizeMode="cover"
      />

      <View style={styles.recipeInfo}>
        <Text style={styles.recipeName}>
          {truncateTitle(item.recipeName)}
        </Text>

        <Text style={styles.recipeCategory}>
          {item.recipeCategory || item.category}
        </Text>

        <Text
          style={styles.recipeDescription}
          numberOfLines={2}
        >
          {item.cookingDescription}
        </Text>
      </View>

      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  // Порожній список
  if (favoriteRecipesList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>♡</Text>

        <Text style={styles.emptyTitle}>
          No favorite recipes yet!
        </Text>

        <Text style={styles.emptyDescription}>
          Explore recipes and tap the heart icon
          to save your favorites.
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>
            Go back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Список обраних рецептів
  return (
    <View
      style={styles.container}
      testID="favoriteRecipes"
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          My Favorite Recipes
        </Text>

        <Text style={styles.subtitle}>
          {favoriteRecipesList.length} saved recipes
        </Text>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        testID="goBackButton"
      >
        <Text style={styles.backButtonText}>
          ← Go back
        </Text>
      </TouchableOpacity>

      <FlatList
        data={favoriteRecipesList}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item) =>
          String(item.idFood)
        }
        renderItem={renderRecipe}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 35,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#334155",
  },

  subtitle: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 6,
  },

  backButton: {
    backgroundColor: "#FACC15",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 20,
  },

  backButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },

  listContainer: {
    paddingBottom: 30,
  },

  recipeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  recipeImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
  },

  recipeInfo: {
    flex: 1,
    paddingHorizontal: 12,
  },

  recipeName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 5,
  },

  recipeCategory: {
    fontSize: 12,
    color: "#F59E0B",
    marginBottom: 6,
  },

  recipeDescription: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 18,
  },

  arrow: {
    fontSize: 26,
    color: "#94A3B8",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 25,
  },

  emptyIcon: {
    fontSize: 70,
    color: "#F59E0B",
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#334155",
    textAlign: "center",
  },

  emptyDescription: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 25,
    lineHeight: 22,
  },
});
