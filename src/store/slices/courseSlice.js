import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSubjects, getSubjectById, getUnitsBySubject, getMissionsByUnit, getMissionById } from '../../models/missionModel';

export const loadSubjects = createAsyncThunk(
  'course/loadSubjects',
  async () => getSubjects()
);

export const loadSubjectDetails = createAsyncThunk(
  'course/loadSubjectDetails',
  async (subjectId) => {
    const subject = getSubjectById(subjectId);
    const unitsRaw = getUnitsBySubject(subjectId);
    
    const units = unitsRaw.map(unit => ({
      ...unit,
      missions: getMissionsByUnit(unit.id)
    }));
    
    return { subject, units };
  }
);

export const loadActiveMission = createAsyncThunk(
  'course/loadActiveMission',
  async (missionId) => getMissionById(missionId)
);

const courseSlice = createSlice({
  name: 'course',
  initialState: {
    subjects: [],
    activeSubject: null, 
    activeUnits: [],     
    activeMission: null,
    loading: false,
    error: null
  },
  reducers: {
    clearActiveMission: (state) => {
      state.activeMission = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSubjects.fulfilled, (state, action) => {
        state.subjects = action.payload;
        state.loading = false;
      })
      .addCase(loadSubjectDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadSubjectDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSubject = action.payload.subject;
        state.activeUnits = action.payload.units;
      })
      .addCase(loadActiveMission.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadActiveMission.fulfilled, (state, action) => {
        state.loading = false;
        state.activeMission = action.payload;
      });
  }
});

export const { clearActiveMission } = courseSlice.actions;
export default courseSlice.reducer;