import { Database } from "../app/generated/types_db";

type Tables = Database["public"]["Tables"];

export type DBTableTypeFinder<
  T extends keyof Tables
> = Database["public"]["Tables"][T]["Row"];
