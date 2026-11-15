
import React from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  toggleFavorite,
} from "../redux/favoritesSlice";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function CustomRecipesScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  // Отримання рецепта з навігації
  const params = route.params;

  const recipe = params?.recipe ?? params;

  // Отримання улюблених рецептів із Redux
  const favoriteRecipes = useSelector(
    (state) => state.favorites.favoriterecipes
  ) ?? [];

  // Підготовка рецепта для Redux
  const favoriteItem = recipe
    ? {
        ...recipe,
        idFood:
          recipe.idFood ??
          `custom-${recipe.title}`,
        recipeName:
          recipe.recipeName ??
          recipe.title,
        recipeImage:
          recipe.recipeImage ??
          recipe.image,
        cookingDescription:
          recipe.cookingDescription ??
          recipe.description,
        recipeCategory:
          recipe.recipeCategory ??
          "Custom",
      }
    : null;

  // Перевірка статусу Favorite
  const isFavorite = favoriteItem
    ? favoriteRecipes.some(
        (item) =>
          String(item.idFood) ===
          String(favoriteItem.idFood)
      )
    : false;

  // Додавання або видалення з Favorites
  const handleToggleFavorite = () => {
    if (favoriteItem) {
      dispatch(toggleFavorite(favoriteItem));
    }
  };

  // Якщо рецепт не передано
  if (!recipe) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No Recipe Details Available
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>
            GoBack
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const recipeTitle =
    recipe.title ?? recipe.recipeName ?? "";

  const recipeImage =
    recipe.image ?? recipe.recipeImage ?? "";

  const recipeDescription =
    recipe.description ??
    recipe.cookingDescription ??
    "";

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Recipe Image */}
      <View
        style={styles.imageContainer}
        testID="imageContainer"
      >
        {recipeImage ? (
          <Image
            source={{ uri: recipeImage }}
            style={styles.articleImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>
              🍲 No Image Available
            </Text>
          </View>
        )}
      </View>

      {/* Top Buttons */}
      <View
        style={styles.topButtonsContainer}
        testID="topButtonsContainer"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          testID="goBackButton"
        >
          <Text style={styles.backButtonText}>
            GoBack
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
          testID="favoriteButton"
        >
          <Text
            style={[
              styles.favoriteIcon,
              isFavorite && styles.activeFavorite,
            ]}
          >
            {isFavorite ? "♥" : "♡"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Recipe Details */}
      <View
        style={styles.contentContainer}
        testID="contentContainer"
      >
        <Text style={styles.recipeTitle}>
          {recipeTitle}
        </Text>

        <View style={styles.descriptionContainer}>
          <Text style={styles.contentHeading}>
            Content
          </Text>

          <Text style={styles.recipeDescription}>
            {recipeDescription}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    paddingBottom: hp(6),
  },

  imageContainer: {
    width: "100%",
    paddingHorizontal: wp(4),
    paddingTop: hp(3),
  },

  articleImage: {
    width: "100%",
    height: hp(35),
    borderRadius: 15,
    backgroundColor: "#F1F5F9",
  },

  imagePlaceholder: {
    height: hp(30),
    backgroundColor: "#F1F5F9",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    fontSize: hp(2),
    color: "#94A3B8",
  },

  topButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(5),
    marginTop: hp(2),
  },

  backButton: {
    backgroundColor: "#F1F5F9",
    paddingVertical: hp(1.4),
    paddingHorizontal: wp(4),
    borderRadius: 10,
  },

  backButtonText: {
    fontSize: hp(1.9),
    fontWeight: "600",
    color: "#334155",
  },

  favoriteButton: {
    width: 50,
    height: 50,
    backgroundColor: "#F1F5F9",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },

  favoriteIcon: {
    fontSize: 35,
    color: "#64748B",
  },

  activeFavorite: {
    color: "#EF4444",
  },

  contentContainer: {
    paddingHorizontal: wp(5),
    paddingTop: hp(3),
  },

  recipeTitle: {
    fontSize: hp(3.3),
    fontWeight: "700",
    color: "#111827",
    marginBottom: hp(3),
  },

  descriptionContainer: {
    backgroundColor: "#F8FAFC",
    padding: wp(4),
    borderRadius: 12,
  },

  contentHeading: {
    fontSize: hp(2.3),
    fontWeight: "700",
    color: "#334155",
    marginBottom: hp(2),
  },

  recipeDescription: {
    fontSize: hp(1.9),
    color: "#475569",
    lineHeight: hp(3),
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: wp(5),
  },

  emptyText: {
    fontSize: hp(2.2),
    color: "#64748B",
    textAlign: "center",
    marginBottom: hp(3),
  },
});
