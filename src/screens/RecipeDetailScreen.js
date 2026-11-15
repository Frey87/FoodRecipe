
import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

export default function RecipeDetailScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const recipe = props.route.params?.item ?? props.route.params;

  const favoriteRecipes = useSelector(
    (state) => state.favorites.favoriteRecipes
  ) || [];

  const isFavorite = favoriteRecipes.some(
    (item) => item.idFood === recipe?.idFood
  );

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text>Recipe not found.</Text>
      </View>
    );
  }

  const toggleFavorite = () => {
    dispatch({
      type: "favorites/toggleFavorite",
      payload: recipe,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View testID="imageContainer">
        <Image
          source={{ uri: recipe.recipeImage }}
          style={styles.recipeImage}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={toggleFavorite}
        >
          <Text style={styles.heart}>
            {isFavorite ? "❤️" : "♡"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View testID="recipeTitle">
          <Text style={styles.title}>
            {recipe.recipeName}
          </Text>
        </View>

        <View testID="recipeCategory">
          <Text style={styles.category}>
            {recipe.recipeCategory || recipe.category}
          </Text>
        </View>

        <View
          testID="miscContainer"
          style={styles.miscContainer}
        >
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>🕒</Text>
            <Text style={styles.infoText}>35 Mins</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>👥</Text>
            <Text style={styles.infoText}>03 Servings</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>🔥</Text>
            <Text style={styles.infoText}>103 Cal</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>🎚️</Text>
            <Text style={styles.infoText}>Medium</Text>
          </View>
        </View>

        <View testID="sectionContainer">
          <Text style={styles.sectionTitle}>
            Ingredients
          </Text>

          <View testID="ingredientsList">
            {(recipe.ingredients || []).map(
              (ingredient, index) => (
                <View
                  key={index}
                  style={styles.ingredientRow}
                >
                  <View style={styles.dot} />
                  <Text style={styles.ingredientText}>
                    {ingredient.ingredientName}{" "}
                    {ingredient.measure}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>

        <View testID="sectionContainer">
          <Text style={styles.sectionTitle}>
            Instructions
          </Text>

          <Text style={styles.instructionsText}>
            {recipe.recipeInstructions}
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
  recipeImage: {
    width: "100%",
    height: 280,
    resizeMode: "cover",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: -265,
    marginBottom: 235,
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    padding: 12,
    elevation: 3,
  },
  heart: {
    fontSize: 20,
    color: "#F59E0B",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#334155",
  },
  category: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 4,
  },
  miscContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 24,
  },
  infoBox: {
    backgroundColor: "#F4F4F5",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    width: "23%",
  },
  infoIcon: {
    fontSize: 22,
    marginBottom: 5,
  },
  infoText: {
    fontSize: 11,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 12,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FACC15",
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 14,
    color: "#334155",
    flex: 1,
  },
  instructionsText: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 23,
  },
});
