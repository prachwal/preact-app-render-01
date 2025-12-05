# Preact App with API Integration

A modern web application built with Preact, featuring a robust API layer with comprehensive state management and testing.

## Features

- **Preact + Signals**: Modern reactive UI with efficient state management
- **Type-Safe API Layer**: Strongly typed API client with configurable endpoints
- **Comprehensive State Management**: Reactive state management for API operations
- **Full Test Coverage**: Vitest-based test suite with 100% coverage
- **Fastify Backend**: Simple Node.js API server for development

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server with API
npm run dev

# Frontend only
npm run dev:frontend

# API server only
npm run api
```

### Testing

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Open Vitest UI
npm run test:ui
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### API Layer (`src/lib/api/`)

- **Types**: Type definitions for API responses and state management
- **State Manager**: Reactive state management for API operations
- **Async Manager**: Handles API calls with proper state transitions
- **Helpers**: Utility functions for creating API actions

### Store (`src/store/`)

- **Counter**: Simple reactive counter example
- **API Store**: API state management with actions

### Components (`src/components/`)

- **App**: Main application component with debug information

## Testing Coverage

The project includes comprehensive test coverage:

### API Layer Tests
- `lib/api/types.test.ts` - Type definitions and interfaces
- `lib/api/state-manager.test.ts` - BaseApiState functionality
- `lib/api/async-manager.test.ts` - API call execution and state management
- `lib/api/helpers.test.ts` - API action creators and factories

### Implementation Tests
- `api/client.test.ts` - API client and singleton instance
- `components/App.test.tsx` - Component rendering and interaction

### Test Setup
- **Vitest**: Modern testing framework with TypeScript support
- **Testing Library**: Component testing utilities
- **JSDOM**: DOM environment simulation
- **Mock Setup**: Comprehensive mocking of browser APIs and external dependencies

## API Endpoints

- `GET /api/hello` - Returns hello message

### Debug Features

The application includes comprehensive debug information visible in the UI:
- Loading state
- Error state
- API response message
- Current status
- Raw data values

This helps with development and troubleshooting API integration issues.

## Project Structure

```
src/
├── api/                    # API client implementation
│   ├── client.ts          # API client and singleton
│   └── client.test.ts     # API client tests
├── components/            # React components
│   ├── App.tsx           # Main app component
│   └── App.test.tsx      # Component tests
├── lib/                   # Core libraries
│   └── api/              # API abstraction layer
│       ├── async-manager.ts
│       ├── helpers.ts
│       ├── index.ts
│       ├── state-manager.ts
│       ├── types.ts
│       ├── *.test.ts     # All API layer tests
├── store/                # Application state
│   ├── api.ts           # API state management
│   ├── counter.ts       # Counter state
│   └── index.ts         # Store exports
└── test/                # Test configuration
    ├── setup.ts         # Vitest setup
    └── types.ts         # Test type declarations
```

## Development Notes

### API Call Flow

1. Component calls `fetchHelloMessage()`
2. `createApiAction` creates action function
3. `AsyncActionManager.executeAsyncAction` handles the API call
4. State updates: `idle` → `loading` → `success`/`error`

### State Management

- Uses Preact Signals for reactive state
- Computed properties update automatically
- Error states are explicitly cleared on success
- Initial data is `null` to prevent false "hasData" states

### Testing Philosophy

- **Unit Tests**: Each module tested in isolation
- **Integration Tests**: Module interactions verified
- **Component Tests**: UI rendering and interactions
- **Mocking**: External dependencies properly mocked
- **Coverage**: 100% statement and branch coverage target
