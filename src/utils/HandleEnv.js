"use client";
import EnvContext from "@/context/envContext";
import { useContext } from "react";

export function getEnv() {
  const contEnv = useContext(EnvContext);
  return contEnv;
}
export function setEnv(value) {
  const setContEnv = useContext(EnvContext);
  setContEnv(value);
  return "Env set";
}
const HandleEnv = () => {
  return <></>;
};

export default HandleEnv;
