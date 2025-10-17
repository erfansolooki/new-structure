import type { IFirstComponent } from "./types"

export const FirstComponent = ({ name }: IFirstComponent) => {
  return <div>{name}</div>;
};