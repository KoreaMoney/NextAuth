"use server";

import { sessionOptions, SessionData, defaultSession } from "@/lib";
import { getIronSession } from "iron-session";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

let username = "korea";
let password = "1234";
let isPro = true;
let isBlocked = true;

export const getSession = async () => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }

  // CHECK THE USER IN THE DB
  session.isBlocked = isBlocked;
  session.isPro = isPro;

  return session;
};

export const login = async (prevState: { error: undefined | string }, formData: FormData) => {
  const session = await getSession();

  const formUsername = formData.get("username") as string;
  const formPassword = formData.get("password") as string;

  // CHECK USER IN THE DB
  // const user = await db.getUser({username,password})

  if (formUsername !== username) {
    return { error: "Wrong username Credentials!" };
  }
  if (formPassword !== password) {
    return { error: "Wrong password Credentials!" };
  }
  session.userId = "1";
  session.username = formUsername;
  session.isPro = isPro;
  session.isLoggedIn = true;

  await session.save();
  redirect("/");
};

export const logout = async () => {
  const session = await getSession();
  session.destroy();
  redirect("/");
};

export const changePremium = async () => {
  const session = await getSession();

  isPro = !session.isPro;
  session.isPro = isPro;
  await session.save();
  revalidatePath("/profile"); // revalidatePath는 특정 경로에 대해 캐시된 데이터를 필요에 따라 제거할 수 있습니다 .
};

export const changeUsername = async (formData: FormData) => {
  const session = await getSession();

  if (!session) {
    throw new Error("No session found");
  }
  const newUsername = formData.get("username") as string;

  if (!newUsername) {
    throw new Error("Username is required");
  }

  session.username = newUsername;
  await session.save();

  revalidatePath("/profile");
};
