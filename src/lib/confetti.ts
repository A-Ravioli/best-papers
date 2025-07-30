// Helper function to fire confetti on successful upload
export const fireConfetti = () => {
  if (typeof window !== 'undefined') {
    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    });
  }
}; 