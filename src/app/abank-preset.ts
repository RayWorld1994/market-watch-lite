import { definePreset } from '@primeuix/themes';
import Aura from '@primeng/themes/aura';

export const abankPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fef2f3',
      100: '#fde3e5',
      200: '#fdcbd0',
      300: '#fba6ae',
      400: '#f7727f',
      500: '#df002d',
      600: '#cc0028',
      700: '#a80021',
      800: '#8c001c',
      900: '#78001c',
      950: '#42000d',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.500}',
          inverseColor: '#ffffff',
          hoverColor: '{primary.600}',
          activeColor: '{primary.700}',
        },
        surface: {
          0: '#ffffff',
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
          950: '#1d1e3f',
        },
      },
      dark: {
        primary: {
          color: '{primary.400}',
          inverseColor: '{surface.950}',
          hoverColor: '{primary.300}',
          activeColor: '{primary.200}',
        },
        surface: {
          0: '#ffffff',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
    },
  },
});
