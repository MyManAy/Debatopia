import { Database } from "./types/generated";

type Tables = Database["public"]["Tables"];

export type DBTableTypeFinder<
  T extends keyof Tables
> = Database["public"]["Tables"][T]["Row"];
