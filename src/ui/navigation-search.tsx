import * as React from "react";
import { SearchField, type SearchFieldProps } from "./search-field";
export type NavigationSearchProps = SearchFieldProps & { filter?: React.ReactNode; toolbarClassName?: string };
/** Search and its independently named filter share one transparent outline. */
export const NavigationSearch = React.forwardRef<HTMLInputElement, NavigationSearchProps>(function NavigationSearch({ filter, toolbarClassName, ...props }, ref) {
  return <div className={`weft-navigation-search ${toolbarClassName ?? ""}`}><SearchField {...props} ref={ref} />{filter}</div>;
});
