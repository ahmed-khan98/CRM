import { createSlice } from "@reduxjs/toolkit";

const uploadSlice = createSlice({
  name: "upload",
  initialState: { leadImportPercent: 0 },
  reducers: {
    setLeadImportProgress: (state, action) => {
      state.leadImportPercent = action.payload;
    },
    resetLeadImportProgress: (state) => {
      state.leadImportPercent = 0;
    },
  },
});

export const { setLeadImportProgress, resetLeadImportProgress } = uploadSlice.actions;
export default uploadSlice.reducer;
