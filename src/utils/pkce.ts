// Utilitários para PKCE (Proof Key for Code Exchange)
// Implementação do fluxo OAuth mais seguro para SPAs

/**
 * Gera uma string aleatória para usar como code_verifier
 */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
}

/**
 * Gera o code_challenge a partir do code_verifier usando SHA256
 */
export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64URLEncode(new Uint8Array(digest));
}

/**
 * Codifica em Base64 URL-safe (sem padding)
 */
function base64URLEncode(array: Uint8Array): string {
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Gera uma string aleatória para o state parameter (proteção CSRF)
 */
export function generateState(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
}

/**
 * Armazena os parâmetros PKCE no sessionStorage para uso no callback
 */
export function storePKCEParams(codeVerifier: string, state: string): void {
  sessionStorage.setItem('spotify_code_verifier', codeVerifier);
  sessionStorage.setItem('spotify_state', state);
}

/**
 * Recupera os parâmetros PKCE do sessionStorage
 */
export function getPKCEParams(): { codeVerifier: string | null; state: string | null } {
  return {
    codeVerifier: sessionStorage.getItem('spotify_code_verifier'),
    state: sessionStorage.getItem('spotify_state'),
  };
}

/**
 * Limpa os parâmetros PKCE do sessionStorage
 */
export function clearPKCEParams(): void {
  sessionStorage.removeItem('spotify_code_verifier');
  sessionStorage.removeItem('spotify_state');
} 