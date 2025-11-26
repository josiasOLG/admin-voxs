/**
 * PrimeNG Design System Preset
 *
 * Configuração centralizada do tema PrimeNG usando a Preset API.
 * Esta abordagem é mais elegante e performática do que CSS variables massivas.
 *
 * @see https://primeng.org/theming
 */
export const VoxsPrimeNGPreset = {
  primitive: {
    // Brand Colors
    purple: {
      50: '#f3f1f9',
      100: '#e1dcf1',
      200: '#c9bfe4',
      300: '#b1a2d7',
      400: '#9985ca',
      500: '#764ba2',
      600: '#6a4492',
      700: '#5e3a8a',
      800: '#523082',
      900: '#46267a',
      950: '#3a1c72',
    },
    blue: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#667eea',
      500: '#5e3a8a',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    slate: {
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
    green: {
      500: '#4ade80',
      600: '#22c55e',
      700: '#16a34a',
    },
    red: {
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
    },
    orange: {
      500: '#fbbf24',
      600: '#f59e0b',
      700: '#d97706',
    },
  },

  semantic: {
    primary: {
      50: '{purple.50}',
      100: '{purple.100}',
      200: '{purple.200}',
      300: '{purple.300}',
      400: '{purple.400}',
      500: '{purple.500}',
      600: '{purple.600}',
      700: '{purple.700}',
      800: '{purple.800}',
      900: '{purple.900}',
      950: '{purple.950}',
    },

    colorScheme: {
      light: {
        primary: {
          color: '{purple.500}',
          contrastColor: '#ffffff',
          hoverColor: '{blue.400}',
          activeColor: '{purple.700}',
        },
        surface: {
          0: '{slate.0}',
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.500}',
          600: '{slate.600}',
          700: '{slate.700}',
          800: '{slate.800}',
          900: '{slate.900}',
          950: '{slate.950}',
        },
      },
      dark: {
        primary: {
          color: '{purple.500}',
          contrastColor: '#ffffff',
          hoverColor: '{blue.400}',
          activeColor: '{purple.700}',
        },
        surface: {
          0: '{slate.950}',
          50: '{slate.900}',
          100: '{slate.800}',
          200: '{slate.700}',
          300: '{slate.600}',
          400: '{slate.500}',
          500: '{slate.400}',
          600: '{slate.300}',
          700: '{slate.200}',
          800: '{slate.100}',
          900: '{slate.50}',
          950: '{slate.0}',
        },
      },
    },
  },

  components: {
    button: {
      root: {
        borderRadius: '6px',
        paddingX: '1.25rem',
        paddingY: '0.75rem',
        gap: '0.5rem',
        transitionDuration: '0.3s',
      },
      colorScheme: {
        light: {
          primary: {
            background: '{purple.500}',
            hoverBackground: '{blue.400}',
            activeBackground: '{purple.700}',
            borderColor: '{purple.500}',
            hoverBorderColor: '{blue.400}',
            activeBorderColor: '{purple.700}',
            color: '#ffffff',
            hoverColor: '#ffffff',
            activeColor: '#ffffff',
          },
          secondary: {
            background: 'transparent',
            hoverBackground: 'rgba(102, 126, 234, 0.1)',
            activeBackground: 'rgba(102, 126, 234, 0.15)',
            borderColor: 'rgba(102, 126, 234, 0.3)',
            hoverBorderColor: 'rgba(102, 126, 234, 0.5)',
            activeBorderColor: 'rgba(102, 126, 234, 0.6)',
            color: '{purple.500}',
            hoverColor: '{blue.400}',
            activeColor: '{purple.700}',
          },
          success: {
            background: '{green.500}',
            hoverBackground: '{green.600}',
            activeBackground: '{green.700}',
            borderColor: '{green.500}',
            color: '#ffffff',
          },
          info: {
            background: '{blue.500}',
            hoverBackground: '{blue.600}',
            activeBackground: '{blue.700}',
            borderColor: '{blue.500}',
            color: '#ffffff',
          },
          warn: {
            background: '{orange.500}',
            hoverBackground: '{orange.600}',
            activeBackground: '{orange.700}',
            borderColor: '{orange.500}',
            color: '#ffffff',
          },
          danger: {
            background: '{red.500}',
            hoverBackground: '{red.600}',
            activeBackground: '{red.700}',
            borderColor: '{red.500}',
            color: '#ffffff',
          },
        },
      },
    },
  },
};
