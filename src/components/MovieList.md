| Piece                  | What it does                                                                                  |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| `currentPage` state    | Tracks which page to fetch next                                                               |
| `hasMoreMoviesRef` ref | Gates observer from firing on last page — ref so observer needs `[]` deps, no reconnect cycle |
| `isFetching` ref       | Locks before fetch, unlocks in `finally` — prevents duplicate page increments                 |
| `observer` ref         | Points to sentinel div at the bottom of the list                                              |
| Fetch `useEffect`      | Runs on `currentPage` change → fetches, appends, dedupes, updates `hasMoreMoviesRef`          |
| Observer `useEffect`   | Created once on mount (`[]`) → watches sentinel → on intersect: lock + increment page         |
| Cleanup `disconnect`   | Tears down observer on unmount — prevents memory leaks                                        |
