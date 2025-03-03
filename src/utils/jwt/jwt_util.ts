// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const decodeJWT = (token: string | null): Record<string, any> | null => {
  try {
    const payloadBase64 = token?.split('.')[1]; // getting payload part
    if (!payloadBase64) return null;

    const decodedPayload = atob(payloadBase64);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Invalid JWT: ', error);
    return null;
  }
};
