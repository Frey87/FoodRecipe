
import React, { useState, useCallback } from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function MyRecipeScreen() {
  const navigation = useNavigation();

  const [recipes, setrecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Завантаження рецептів з AsyncStorage
  const fetchrecipes = async () => {
    try {
      const storedRecipes = await AsyncStorage.getItem(
        "customrecipes"
      );

      const parsedRecipes = storedRecipes
        ? JSON.parse(storedRecipes)
        : [];

      setrecipes(
        Array.isArray(parsedRecipes) ? parsedRecipes : []
      );
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setrecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // Оновлення списку при кожному відкритті екрана
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchrecipes();
    }, [])
  );

  // Створення нового рецепта
  const handleAddrecipe = () => {
    navigation.navigate("RecipesFormScreen");
  };

  // Перегляд власного рецепта
  const handlerecipeClick = (recipe) => {
    navigation.navigate("CustomRecipesScreen", {
      recipe,
    });
  };

  // Видалення рецепта
  const deleterecipe = async (index) => {
    try {
      const storedRecipes = await AsyncStorage.getItem(
        "customrecipes"
      );

      const currentRecipes = storedRecipes
        ? JSON.parse(storedRecipes)
        : [];

      if (
        !Array.isArray(currentRecipes) ||
        index < 0 ||
        index >= currentRecipes.length
      ) {
        throw new Error("Invalid recipe index");
      }

      currentRecipes.splice(index, 1);

      await AsyncStorage.setItem(
        "customrecipes",
        JSON.stringify(currentRecipes)
      );

      setrecipes(currentRecipes);
    } catch (error) {
      console.error("Error deleting recipe:", error);

      if (Platform.OS === "web") {
        window.alert("Failed to delete recipe.");
      } else {
        Alert.alert(
          "Error",
          "Failed to delete recipe."
        );
      }
    }
  };

  // Підтвердження видалення
  const confirmDelete = (index) => {
    if (Platform.OS === "web") {
      if (window.confirm("Delete this recipe?")) {
        deleterecipe(index);
      }
    } else {
      Alert.alert(
        "Delete Recipe",
        "Are you sure you want to delete this recipe?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => deleterecipe(index),
          },
        ]
      );
    }
  };

  // Редагування рецепта
  const editrecipe = (recipe, index) => {
    navigation.navigate("RecipesFormScreen", {
      recipeToEdit: recipe,
      recipeIndex: index,
    });
  };

  return (
    <View style={styles.container}>
      {/* Кнопка повернення */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>
          ← Back
        </Text>
      </TouchableOpacity>

      {/* Заголовок */}
      <Text style={styles.screenTitle}>
        My Food
      </Text>

      <Text style={styles.subtitle}>
        Create and manage your own recipes
      </Text>

      {/* Кнопка додавання */}
      <TouchableOpacity
        onPress={handleAddrecipe}
        style={styles.addButton}
        testID="addRecipeButton"
      >
        <Text style={styles.addButtonText}>
          + Add New Recipe
        </Text>
      </TouchableOpacity>

      {/* Завантаження */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#F59E0B"
          />
          <Text style={styles.loadingText}>
            Loading recipes...
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {recipes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>
                🍽️
              </Text>

              <Text style={styles.norecipesText}>
                No recipes added yet.
              </Text>

              <Text style={styles.emptyDescription}>
                Tap Add New Recipe to create
                your first recipe.
              </Text>
            </View>
          ) : (
            recipes.map((recipe, index) => (
              <View
                key={index}
                style={styles.recipeCard}
                testID="recipeCard"
              >
                {/* Перегляд рецепта */}
                <TouchableOpacity
                  testID="handlerecipeBtn"
                  onPress={() =>
                    handlerecipeClick(recipe)
                  }
                >
                  {/* Фотографія */}
                  {recipe.image ? (
                    <Image
                      source={{ uri: recipe.image }}
                      style={styles.recipeImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Text style={styles.placeholderText}>
                        🍲 No Image
                      </Text>
                    </View>
                  )}

                  {/* Назва */}
                  <Text style={styles.recipeTitle}>
                    {recipe.title}
                  </Text>

                  {/* Опис */}
                  <Text
                    style={styles.recipeDescription}
                    testID="recipeDescp"
                    numberOfLines={3}
                  >
                    {recipe.description}
                  </Text>
                </TouchableOpacity>

                {/* Редагування та видалення */}
                <View
                  style={styles.actionButtonsContainer}
                  testID="editDeleteButtons"
                >
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() =>
                      editrecipe(recipe, index)
                    }
                    testID="editRecipeButton"
                  >
                    <Text style={styles.editButtonText}>
                      Edit
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() =>
                      confirmDelete(index)
                    }
                    testID="deleteRecipeButton"
                  >
                    <Text style={styles.deleteButtonText}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
    backgroundColor: "#F9FAFB",
  },

  backButton: {
    marginBottom: hp(2),
    alignSelf: "flex-start",
  },

  backButtonText: {
    fontSize: hp(2.2),
    color: "#4F75FF",
    fontWeight: "600",
  },

  screenTitle: {
    fontSize: hp(3.5),
    fontWeight: "700",
    color: "#334155",
    marginBottom: hp(1),
  },

  subtitle: {
    fontSize: hp(1.8),
    color: "#94A3B8",
    marginBottom: hp(2),
  },

  addButton: {
    backgroundColor: "#4F75FF",
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: "100%",
    marginBottom: hp(3),
  },

  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: hp(2.1),
  },

  scrollContainer: {
    paddingBottom: hp(4),
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: hp(2),
    color: "#64748B",
    fontSize: hp(1.8),
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(8),
    paddingHorizontal: wp(4),
  },

  emptyIcon: {
    fontSize: hp(6),
    marginBottom: hp(2),
  },

  norecipesText: {
    textAlign: "center",
    fontSize: hp(2.2),
    fontWeight: "600",
    color: "#6B7280",
  },

  emptyDescription: {
    fontSize: hp(1.8),
    color: "#94A3B8",
    textAlign: "center",
    marginTop: hp(1),
  },

  recipeCard: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    padding: wp(3),
    borderRadius: 12,
    marginBottom: hp(2),
    marginHorizontal: 5,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
  },

  recipeImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: hp(1.5),
    backgroundColor: "#F1F5F9",
  },

  imagePlaceholder: {
    height: 180,
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(1.5),
  },

  placeholderText: {
    fontSize: 16,
    color: "#94A3B8",
  },

  recipeTitle: {
    fontSize: hp(2.2),
    fontWeight: "700",
    color: "#111827",
    marginBottom: hp(1),
  },

  recipeDescription: {
    fontSize: hp(1.8),
    color: "#6B7280",
    lineHeight: hp(2.6),
    marginBottom: hp(1.5),
  },

  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(1),
    gap: 12,
  },

  editButton: {
    backgroundColor: "#34D399",
    paddingVertical: hp(1.5),
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },

  editButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: hp(1.8),
  },

  deleteButton: {
    backgroundColor: "#EF4444",
    paddingVertical: hp(1.5),
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },

  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: hp(1.8),
  },
});
