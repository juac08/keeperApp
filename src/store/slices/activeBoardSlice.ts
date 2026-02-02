import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ActiveBoardState {
  activeBoardId: string | null;
}

const initialState: ActiveBoardState = {
  activeBoardId: localStorage.getItem("activeBoardId") || null,
};

const activeBoardSlice = createSlice({
  name: "activeBoard",
  initialState,
  reducers: {
    setActiveBoard: (state, action: PayloadAction<string | null>) => {
      state.activeBoardId = action.payload;
      if (action.payload) {
        localStorage.setItem("activeBoardId", action.payload);
      } else {
        localStorage.removeItem("activeBoardId");
      }
    },
  },
});

export const { setActiveBoard } = activeBoardSlice.actions;
export default activeBoardSlice.reducer;
