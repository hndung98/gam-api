export class MockPrismaService {
  private userData = [
    {
      id: '1',
      username: 'alice',
      email: 'alice@example.com',
      password: 'hashedPassword',
      phone: '0123001001',
      isVerified: true,
    },
    {
      id: '2',
      username: 'bob',
      email: 'bob@example.com',
      password: 'hashedPassword',
      phone: '0123001002',
      isVerified: false,
    },
  ];

  private profileData = [
    {
      id: '1',
      userId: '1',
      fullName: 'Mock Alice',
      address: '',
      gender: 'FEMALE',
    },
    {
      id: '2',
      userId: '2',
      fullName: 'Mock Bob',
      address: '',
      gender: 'MALE',
    },
  ];

  private tokenBlacklistData = [{ id: 1, token: 'token1' }];

  user = {
    findMany: jest.fn().mockResolvedValue(this.userData),
    findUnique: jest.fn().mockImplementation(({ where }) => {
      return (
        this.userData.find(
          (u) =>
            (where?.id && u.id === where?.id) ||
            (where?.phone && u.phone === where?.phone),
        ) || null
      );
    }),
    findFirst: jest.fn().mockImplementation(({ where }) => {
      if (where.phone)
        return this.userData.find((u) => u.phone === where.phone) || null;
      if (where.email)
        return this.userData.find((u) => u.email === where.email) || null;
      if (where.username)
        return this.userData.find((u) => u.username === where.username) || null;
      return null;
    }),
    create: jest.fn().mockImplementation(({ data }) => {
      const newUser = { id: (this.userData.length + 1).toString(), ...data };
      this.userData.push(newUser);
      return newUser;
    }),
    update: jest.fn().mockImplementation(({ where, data }) => {
      const index = this.userData.findIndex((u) => u.id === where.id);
      if (index < 0) return null;
      this.userData[index] = { ...this.userData[index], ...data };
      return this.userData[index];
    }),
    delete: jest.fn().mockImplementation(({ where }) => {
      const index = this.userData.findIndex((u) => u.id === where.id);
      if (index < 0) return null;
      const deleted = this.userData[index];
      this.userData.splice(index, 1);
      return deleted;
    }),
  };

  product = {
    findMany: jest.fn(),
  };

  profile = {
    create: jest.fn().mockImplementation(({ data }) => {
      const newProfile = {
        id: (this.profileData.length + 1).toString(),
        ...data,
      };
      this.profileData.push(newProfile);
      return newProfile;
    }),
    findFirst: jest.fn().mockImplementation(({ where }) => {
      return this.profileData.find((p) => p.userId === where.userId) || null;
    }),
  };

  tokenBlacklist = {
    create: jest.fn().mockImplementation((token) => {
      const existingToken = this.tokenBlacklistData.find(
        (t) => t.token === token,
      );
      if (existingToken) return false;
      const newTokenBlacklist = {
        id: this.tokenBlacklistData.length + 1,
        token,
      };
      this.tokenBlacklistData.push(newTokenBlacklist);
      return true;
    }),
    findUnique: jest.fn().mockImplementation(({ where }) => {
      return (
        this.tokenBlacklistData.find((t) => t.token === where.token) || null
      );
    }),
  };

  $transaction = jest.fn().mockImplementation(async (operations) => {
    // if array of promises
    if (Array.isArray(operations)) {
      return Promise.all(operations);
    }
    // if callback
    if (typeof operations === 'function') {
      return operations(this);
    }

    throw new Error('$transaction requires array or callback');
  });
}
