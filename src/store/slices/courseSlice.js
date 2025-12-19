import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generateCourseWithAi, refineCourseWithAi, sendMessageToAi } from '../../models/aiModel';
import {
  fetchUserCourses,
  saveCourseToDb,
  updateUserCourse,
  deleteUserCourse,
} from '../../models/courseModel';

export const loadCourses = createAsyncThunk('courses/load', async (uid, { rejectWithValue }) => {
  try {
    if (!uid) throw new Error('No UID');
    return await fetchUserCourses(uid);
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const createCourse = createAsyncThunk(
  'courses/create',
  async ({ uid, topic, age }, { rejectWithValue }) => {
    try {
      const d = await generateCourseWithAi(topic, age);
      return await saveCourseToDb(uid, d);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const updateCourse = createAsyncThunk(
  'courses/update',
  async ({ uid, courseId, courseData }, { rejectWithValue }) => {
    try {
      return await updateUserCourse(uid, courseId, courseData);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const modifyCourseWithAi = createAsyncThunk(
  'courses/modifyAi',
  async ({ uid, course, instruction, age }, { rejectWithValue }) => {
    try {
      const d = await refineCourseWithAi(course, instruction, age);
      return await updateUserCourse(uid, course.id, d);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/delete',
  async ({ uid, courseId }, { rejectWithValue }) => {
    try {
      await deleteUserCourse(uid, courseId);
      return courseId;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const loadActiveCourse = createAsyncThunk(
  'courses/loadActiveCourse',
  async ({ uid, courseId }, { getState, dispatch, rejectWithValue }) => {
    try {
      let { list } = getState().courses;
      if (!list || list.length === 0) {
        const action = await dispatch(loadCourses(uid));
        if (loadCourses.fulfilled.match(action)) list = action.payload;
        else throw new Error('Failed to restore courses');
      }

      const course = list.find((c) => c.id === courseId);
      if (!course) throw new Error('Course not found');
      return course;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const loadActiveMission = createAsyncThunk(
  'courses/loadMission',
  async ({ uid, missionId }, { getState, dispatch, rejectWithValue }) => {
    try {
      let { list } = getState().courses;
      if (!list || list.length === 0) {
        const action = await dispatch(loadCourses(uid));
        if (loadCourses.fulfilled.match(action)) list = action.payload;
        else throw new Error('Failed to restore courses');
      }

      for (const course of list) {
        if (!course.units) continue;
        for (const unit of course.units) {
          if (!unit.missions) continue;
          const mission = unit.missions.find((m) => m.id === missionId);
          if (mission) return { ...mission, unitId: unit.id, courseId: course.id };
        }
      }

      throw new Error('Mission not found');
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const askLumenHelp = createAsyncThunk(
  'courses/askLumen',
  async ({ prompt, userAge }, { rejectWithValue }) => {
    try {
      const response = await sendMessageToAi(prompt, userAge, []);
      return response.text;
    } catch (e) {
      return rejectWithValue('Oops! My brain froze. Try again later! 🧊');
    }
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    list: [],
    activeCourse: null,
    activeMission: null,

    aiHelp: '',
    aiHelpStatus: 'idle', 

    loading: false,
    error: null,
  },
  reducers: {
    setActiveCourse: (state, action) => {
      state.activeCourse = state.list.find((c) => c.id === action.payload) || null;
    },
    clearActiveMission: (state) => {
      state.activeMission = null;
      state.aiHelp = '';
      state.aiHelpStatus = 'idle';
      state.error = null;
    },
    clearAiHelp: (state) => {
      state.aiHelp = '';
      state.aiHelpStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCourses.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.loading = false;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
        state.activeCourse = action.payload;
        state.loading = false;
      })
      .addCase(modifyCourseWithAi.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
        state.activeCourse = action.payload;
        state.loading = false;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
        if (state.activeCourse?.id === action.payload) state.activeCourse = null;
        state.loading = false;
      })
      .addCase(loadActiveCourse.fulfilled, (state, action) => {
        state.activeCourse = action.payload;
        state.loading = false;
      })
      .addCase(loadActiveMission.fulfilled, (state, action) => {
        state.activeMission = action.payload;
        state.loading = false;
      })

      .addCase(askLumenHelp.pending, (state) => {
        state.aiHelpStatus = 'loading';
        state.aiHelp = '';
      })
      .addCase(askLumenHelp.fulfilled, (state, action) => {
        state.aiHelpStatus = 'succeeded';
        state.aiHelp = action.payload;
      })
      .addCase(askLumenHelp.rejected, (state, action) => {
        state.aiHelpStatus = 'failed';
        state.aiHelp = action.payload || 'Oops! My brain froze. Try again later! 🧊';
      })

      .addMatcher(
        (action) => action.type.endsWith('/pending') && action.type !== askLumenHelp.pending.type,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.endsWith('/fulfilled') && action.type !== askLumenHelp.fulfilled.type,
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected') && action.type !== askLumenHelp.rejected.type,
        (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error?.message || 'Something went wrong';
        }
      );
  },
});

export const { setActiveCourse, clearActiveMission, clearAiHelp } = courseSlice.actions;
export default courseSlice.reducer;
