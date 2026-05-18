const USER_TOKEN_KEY = 'campus_voice_user_token';
const DEPARTMENT_KEY = 'campus_voice_department';

export function getUserToken() {
  const existing = localStorage.getItem(USER_TOKEN_KEY);
  if (existing) return existing;

  const token =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  localStorage.setItem(USER_TOKEN_KEY, token);
  return token;
}

export function getUserDepartment() {
  return localStorage.getItem(DEPARTMENT_KEY) || '컴퓨터공학과';
}
