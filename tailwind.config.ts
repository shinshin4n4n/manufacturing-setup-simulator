import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderWidth: {
        '3': '3px',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        slate: {
          850: '#1a2332',
          950: '#0f172a',
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-in-out',
        scaleIn: 'scaleIn 0.2s ease-in-out',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'counter': 'counter 1s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
          },
          '50%': {
            opacity: '0.8',
            boxShadow: '0 0 40px rgba(6, 182, 212, 0.6)',
          },
        },
        'slide-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'counter': {
          '0%': {
            transform: 'scale(0.5)',
            opacity: '0',
          },
          '50%': {
            transform: 'scale(1.1)',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        'shimmer': {
          '0%': {
            backgroundPosition: '-1000px 0',
          },
          '100%': {
            backgroundPosition: '1000px 0',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-gradient': 'radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 0.2) 0px, transparent 50%), radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 0.15) 0px, transparent 50%), radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 0.2) 0px, transparent 50%), radial-gradient(at 10% 29%, hsla(256, 96%, 67%, 0.15) 0px, transparent 50%), radial-gradient(at 97% 96%, hsla(38, 60%, 74%, 0.2) 0px, transparent 50%), radial-gradient(at 33% 50%, hsla(222, 67%, 73%, 0.15) 0px, transparent 50%), radial-gradient(at 79% 53%, hsla(343, 68%, 79%, 0.2) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
} satisfies Config;
