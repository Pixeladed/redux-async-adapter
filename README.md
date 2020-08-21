# Redux Async Adapter

A simple redux toolkit adapter to handle loading states for async thunks. Inspired by Redux Toolkit's `createEntityAdapter` and is designed to work with Redux Toolkit's `createAsyncThunk`.

## Overview

A function that generates a set of reducers and selectors for keeping track of loading state (loading, loaded, error, lastLoaded) for different async operations. It supports multiple loading statuses within a state.

The methods generated by `createAsyncAdapter` will all manipulate an "async state" structure that looks like:

```typescript
import { SerializedError } from '@reduxjs/toolkit';

export interface AsyncState<T> {
  status: { [name: string]: AsyncStatus | undefined };
  data: T;
}

export interface AsyncStatus {
  name: string;
  loading: boolean;
  loaded: boolean;
  error: SerializedError | undefined;
  lastLoaded: string | undefined;
}
```

`createAsyncAdapter` can be called multiple times within an application and can handle async thunks created by `createAsyncThunk`

## Example

```typescript
import createAsyncAdapter from 'redux-async-adapter'
import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// create the adapter
const asyncAdapter = createAsyncAdapter()

// create an async thunk that load books
const fetchBooks = createAsyncThunk(
  'books/fetch',
  async () => {
    // fetch books from some api
    return ['book 1', 'book 2']
  }
)

const booksSlice = createSlice({
  name: 'books',
  initialState: asyncAdapter.getInitialState([])
  reducers: {},
  extraReducers: {
    // use the handler directly
    [fetchBooks.pending.type]: asyncAdapter.handlePending(fetchBooks),

    // use the handler as part of a reducer
    [fetchBooks.fulfilled.type]: (state, action) => {
      asyncAdapter.handleFulfilled(fetchBooks)(state)
      state = action.payload
    },

    [fetchBooks.rejected.type]: asyncAdapter.handleRejected(fetchBooks),
  }
})

const store = configureStore({
  reducer: {
    books: booksSlice.reducer
  }
})

// use the selectors to get the thunk's status
const fetchBooksStatus =
  asyncAdapter
    .getSelectors()
    .selectAsyncStatus(store.getState(), fetchBooks)

// access the various statuses
const {loading, error, loaded, lastLoaded} = fetchBooksStatus
```

## Parameters

`createAsyncAdapter` requires no parameters

## Return Value

`createAsyncAdapter` returns an object that looks like this:

```typescript
{
  getInitialState: <T>(initialData: T) => AsyncState<T>,
  getSelectors: () => ({
    selectStatus: (state: AsyncState, thunk: AsyncThunk) => AsyncStatus,
    selectAllStatuses: (state: AsyncState) => AsyncStatus[],
    selectAnyLoading: (state: AsyncState) => boolean,
    selectAllErrors: (state: AsyncState) => SerializedError[],
    selectAllFinished: (state: AsyncState) => boolean
  }),
  handlePending: (thunk: AsyncThunk) => (state: AsyncState) => void,
  handleFulfilled: (thunk: AsyncThunk) => (state: AsyncState) => void,
  handleRejected: (thunk: AsyncThunk) => (state: AsyncState, action: AsyncThunk['rejected']) => void,
}
```

### State

- `getInitialState`: accepts a `initialData` parameter of any type and return an `AsyncState` with that initial data and an empty status array

```typescript
const initialState = adapter.getInitialState({});
// initialState is { status: {}, data: {} }
```

### Handlers

All handlers accept an `asyncThunk` (created by redux toolkit's `createAsyncThunk`) and return a reducer that can be used to update the status for that thunk.

- `handlePending`: accepts an `asyncThunk` and return a reducer that reset error and loaded state and set loading to true for that thunk.

```typescript
adapter.handlePending(thunk)(state);
```

- `handleFulfilled`: accepts an `asyncThunk` and return a reducer that reset error and loading state and set loaded to true and update lastLoaded timestamp (ISO formatted)

```typescript
adapter.handleFulfilled(thunk)(state);
```

- `handleRejected`: accepts an `asyncThunk` and return a reducer that reset loaded and loading state and update the error field with the error provided in the action

```typescript
adapter.handleRejected(thunk)(state, action);
```

### Selectors

- `selectStatus`: accepts an `asyncThunk` (created by redux toolkit's `createAsyncThunk`) and the state and returns the status object of that particular thunk

```typescript
adapter.getSelectors().selectStatus(state, thunk);
```

- `selectAllStatuses`: returns an array of all status objects within the state

```typescript
adapter.getSelectors().selectAllStatuses(state);
```

- `selectAnyLoading`: returns whether or not any thunks within the state is currently loading

```typescript
adapter.getSelectors().selectAnyLoading(state);
```

- `selectAllErrors`: returns a list of all the errors in the state

```typescript
adapter.getSelectors().selectAllErrors(state);
```

- `selectAllFinished`: returns whether or not all thunk in the state has finished (loaded)

```typescript
adapter.getSelectors().selectAllFinished(state);
```