import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { PhotoEntity } from '../entities/photo.entity';
// Define a separate interface for Photo with url
interface PhotoWithUrl extends PhotoEntity {
  id: number;
  url: string;
  // other properties as needed
}

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            getAllUsers: jest.fn(),
            getUserById: jest.fn(),
            updateUser: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        positionId: '1', // Adjust as necessary
        photoId: '1', // Adjust as necessary
      };

      const createdUser: UserEntity = {
        id: 1,
        ...createUserDto,
        position: null,
        isActive: true,
        photo: { id: 1, url: 'path/to/photo' } as PhotoWithUrl, // Example of a photo object with url
      };

      jest.spyOn(userService, 'createUser').mockResolvedValue(createdUser);

      const result = await controller.createUser(createUserDto);
      expect(result).toEqual(createdUser);
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        positionId: '1',
        isActive: false,
      };

      const existingUser: UserEntity = {
        id: userId,
        firstName: 'John',
        lastName: 'Doe',
        position: null,
        isActive: true,
        photo: null,
      };

      jest.spyOn(userService, 'getUserById').mockResolvedValue(existingUser);
      jest.spyOn(userService, 'updateUser').mockResolvedValue({
        ...existingUser,
        ...updateUserDto,
      });

      const result = await controller.updateUser(userId, updateUserDto);
      expect(result).toEqual({
        ...existingUser,
        ...updateUserDto,
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      const userId = 999;
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        positionId: '1',
        isActive: false,
      };

      jest.spyOn(userService, 'getUserById').mockResolvedValue(null);

      await expect(
        controller.updateUser(userId, updateUserDto),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const users: UserEntity[] = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          position: null,
          isActive: true,
          photo: null,
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          position: null,
          isActive: true,
          photo: null,
        },
      ];

      jest.spyOn(userService, 'getAllUsers').mockResolvedValue(users);

      const result = await controller.getAllUsers();
      expect(result).toEqual(users);
    });
  });

  describe('getUserById', () => {
    it('should return a single user by ID', async () => {
      const userId = 1;
      const user: UserEntity = {
        id: userId,
        firstName: 'John',
        lastName: 'Doe',
        position: null,
        isActive: true,
        photo: null,
      };

      jest.spyOn(userService, 'getUserById').mockResolvedValue(user);

      const result = await controller.getUserById(userId);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user with given ID is not found', async () => {
      const userId = 999;

      jest.spyOn(userService, 'getUserById').mockResolvedValue(null);

      await expect(controller.getUserById(userId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const userId = 1;

      jest.spyOn(userService, 'remove').mockResolvedValue(undefined);

      await controller.deleteUser(userId);
      expect(userService.remove).toHaveBeenCalledWith(userId);
    });
  });

  // Add more test cases as needed for other controller methods
});
