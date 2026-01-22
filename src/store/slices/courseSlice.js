import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generateCourseWithAi, refineCourseWithAi, sendMessageToAi } from '../../models/aiModel';

export const loadCourses = createAsyncThunk('courses/load', async (uid) => {
  return uid;
});

export const createCourse = createAsyncThunk(
  'courses/create',
  async ({ uid, topic, age }, { rejectWithValue }) => {
    try {
      const courseData = await generateCourseWithAi(topic, age);
      const timestamp = Date.now();
      courseData.createdAt = new Date().toISOString();

      if (courseData.units) {
        courseData.units.forEach((unit, uIdx) => {
          unit.id = `u_${timestamp}_${uIdx}`;
          if (unit.missions) {
            unit.missions.forEach((mission, mIdx) => {
              mission.id = `m_${timestamp}_${uIdx}_${mIdx}`;
              if (!mission.tasks) mission.tasks = [];
            });
          }
        });
      }

      const tempId = `temp_${timestamp}`;
      courseData.id = tempId;
      return { uid, courseData };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const modifyCourseWithAi = createAsyncThunk(
  'courses/modifyAi',
  async ({ uid, course, instruction, age }, { rejectWithValue, dispatch }) => {
    try {
      const updatedData = await refineCourseWithAi(course, instruction, age);
      const updatedCourse = { ...updatedData, id: course.id };
      
      dispatch(courseUpdated({ uid, courseId: course.id, courseData: updatedCourse }));
      
      return { uid, courseId: course.id, courseData: updatedCourse };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const updateCourse = createAsyncThunk(
  'courses/update',
  async ({ uid, courseId, courseData }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(courseUpdated({ uid, courseId, courseData }));
      return { uid, courseId, courseData };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/delete',
  async ({ uid, courseId }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(courseDeleted({ uid, courseId }));
      return { courseId };
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
        dispatch(loadCourses(uid));
        
        for (let i = 0; i < 20; i++) {
          await new Promise(resolve => setTimeout(resolve, 100));
          const newState = getState();
          if (newState.courses.list.length > 0) {
            break;
          }
        }
        
        list = getState().courses.list;
      }

      const course = list.find((c) => c.id === courseId);
      
      if (!course) {
        throw new Error('Course not found');
      }
      
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
        dispatch(loadCourses(uid));
        
        for (let i = 0; i < 20; i++) {
          await new Promise(resolve => setTimeout(resolve, 100));
          const newState = getState();
          if (newState.courses.list.length > 0) {
            break;
          }
        }
        
        list = getState().courses.list;
      }

      for (const course of list) {
        if (!course.units) continue;
        for (const unit of course.units) {
          if (!unit.missions) continue;
          const mission = unit.missions.find((m) => m.id === missionId);
          if (mission) {
            return { ...mission, unitId: unit.id, courseId: course.id };
          }
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
    coursesLoaded: (state, action) => {
      state.list = action.payload;
      state.loading = false;
    },
    courseAdded: (state, action) => {
      const { courseData } = action.payload;
      const exists = state.list.find(c => c.id === courseData.id);
      if (!exists) {
        state.list.push(courseData);
      }
      state.loading = false;
    },
    courseUpdated: (state, action) => {
      const { courseId, courseData } = action.payload;
      const idx = state.list.findIndex((c) => c.id === courseId);
      
      if (idx !== -1) {
        state.list[idx] = { ...state.list[idx], ...courseData };
      }
      
      if (state.activeCourse?.id === courseId) {
        state.activeCourse = { ...state.activeCourse, ...courseData };
      }
      
      state.loading = false;
    },
    courseIdReplaced: (state, action) => {
      const { oldId, newId, courseData } = action.payload;
      const idx = state.list.findIndex((c) => c.id === oldId);
      
      if (idx !== -1) {
        state.list.splice(idx, 1);
        state.list.push({ ...courseData, id: newId });
      }
      
      state.loading = false;
    },
    courseDeleted: (state, action) => {
      const { courseId } = action.payload;
      state.list = state.list.filter((c) => c.id !== courseId);
      if (state.activeCourse?.id === courseId) state.activeCourse = null;
      state.loading = false;
    },
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
      .addCase(loadCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCourses.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(loadCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load courses';
      })
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create course';
      })
      .addCase(modifyCourseWithAi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(modifyCourseWithAi.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(modifyCourseWithAi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to modify course';
      })
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update course';
      })
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete course';
      })
      .addCase(loadActiveCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadActiveCourse.fulfilled, (state, action) => {
        state.activeCourse = action.payload;
        state.loading = false;
      })
      .addCase(loadActiveCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load course';
      })
      .addCase(loadActiveMission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadActiveMission.fulfilled, (state, action) => {
        state.activeMission = action.payload;
        state.loading = false;
      })
      .addCase(loadActiveMission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load mission';
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
      });
  },
});

export const {
  coursesLoaded,
  courseAdded,
  courseUpdated,
  courseIdReplaced,
  courseDeleted,
  setActiveCourse,
  clearActiveMission,
  clearAiHelp,
} = courseSlice.actions;

export default courseSlice.reducer;
