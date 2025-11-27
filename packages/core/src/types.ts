import type { FilterPattern } from "unplugin-utils";

export interface Options {
  comments?: FilterPattern;
  include?: FilterPattern;
  exclude?: FilterPattern;
}