import { useData } from "../context/DataContext";
import { addReview, updateReview, deleteReview } from "../api/api";
import { NewReview, Review } from "../types";

export const useReviewHandlers = () => {
  const { state, dispatch } = useData();
  const token = state.auth.token;
  const user = state.auth.user;

  const addReviewHandler = async (reviewPayload: NewReview) => {
    if (!user || !token) return;
    try {
      const addedReview: Review = await addReview(reviewPayload, token);
      if (!addedReview.user) {
        addedReview.user = user;
      }
      dispatch({
        type: "ADD_REVIEW",
        payload: { gameId: reviewPayload.gameId, review: addedReview },
      });
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const updateReviewHandler = async (
    gameId: number,
    reviewId: number,
    updatedData: { rating: number; comment: string }
  ) => {
    if (!user || !token) return;
    try {
      await updateReview(reviewId, updatedData, token);
      dispatch({
        type: "UPDATE_REVIEW",
        payload: {
          gameId,
          review: { id: reviewId, ...updatedData, gameId, userId: user.id, user },
        },
      });
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const deleteReviewHandler = async (gameId: number, reviewId: number) => {
    if (!user || !token) return;
    try {
      await deleteReview(reviewId, token);
      dispatch({
        type: "DELETE_REVIEW",
        payload: { gameId, reviewId },
      });
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return { addReviewHandler, updateReviewHandler, deleteReviewHandler };
};
