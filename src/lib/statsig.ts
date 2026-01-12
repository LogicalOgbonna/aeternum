'use client';

export const getUserId = () => {
  // Only access localStorage on the client side
  if (typeof window === 'undefined') {
    return crypto.randomUUID();
  }
  
  const userId = localStorage.getItem('statsig.userId');
  if (!userId) {
    const newUserId = crypto.randomUUID();
    localStorage.setItem('statsig.userId', newUserId);
    return newUserId;
  }
  return userId;
};
