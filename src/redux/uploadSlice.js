import { createSlice } from "@reduxjs/toolkit";

const uploadSlice = createSlice({
  name: "upload",
  initialState: { leadImportPercent: 0,TmImportPercent: 0 },
  reducers: {
    setLeadImportProgress: (state, action) => {
      state.leadImportPercent = action.payload;
    },
    resetLeadImportProgress: (state) => {
      state.leadImportPercent = 0;
    },
    setTmImportProgress: (state, action) => {
      state.TmImportPercent = action.payload;
    },
    resetTmImportProgress: (state) => {
      state.TmImportPercent = 0;
    },
  },
});

export const { setLeadImportProgress, resetLeadImportProgress,setTmImportProgress ,resetTmImportProgress} = uploadSlice.actions;
export default uploadSlice.reducer;
