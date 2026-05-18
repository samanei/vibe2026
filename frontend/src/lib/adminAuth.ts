// 관리자 로그인 세션을 브라우저 저장소에 기록하는 헬퍼
const ADMIN_CODE = 'admin2026';
const ADMIN_STORAGE_KEY = 'isAdmin';

export function validateAdminCode(code: string) {
  return code.trim() === ADMIN_CODE;
}

export function setAdminSession() {
  localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_STORAGE_KEY);
}

export function isAdminAuthenticated() {
  return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
}
