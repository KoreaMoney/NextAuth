"use server";

import { sessionOptions, SessionData, defaultSession } from "@/lib";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

// 현재 세션을 가져오는 역할
export const getSession = async () => {
  /**
   * cookies()는 현재 요청의 쿠키를 가져옵니다.
   * sessionOptions는 iron-session 설정을 포함합니다.
   */
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }
  return session;
};
export const login = async () => {};
export const logout = async () => {};
