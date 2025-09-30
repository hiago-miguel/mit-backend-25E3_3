const originalConsole = console;
global.console = {
  ...originalConsole,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
};

jest.setTimeout(10000);

jest.mock('mongoose', () => ({
  connect: jest.fn(),
  connection: {
    collections: {},
    db: null
  },
  model: jest.fn(() => ({
    create: jest.fn(),
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn()
    }),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn()
    }),
    find: jest.fn().mockReturnValue({
      exec: jest.fn()
    }),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn()
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: jest.fn()
    }),
    countDocuments: jest.fn().mockReturnValue({
      exec: jest.fn()
    }),
    deleteMany: jest.fn().mockReturnValue({
      exec: jest.fn()
    })
  })),
  Schema: jest.fn().mockImplementation(() => ({
    index: jest.fn(),
    set: jest.fn()
  })),
  Types: {
    ObjectId: {
      isValid: jest.fn(() => true)
    }
  }
}));
