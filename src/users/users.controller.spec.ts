import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllQueryDto } from './dto/findall-query.dto';
import { UserEntity, Gender } from '../entities/user.entity';
import { HttpStatus, NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            updateUser: jest.fn(),
            findAll: jest.fn(),
            getAllUsers: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        birthDate: new Date('1990-01-01'),
        hireDate: new Date('2020-01-01'),
        gender: Gender.Male,
        positionId: '1', // Assuming you have a valid positionId
        photoId: 'xyz', // Assuming you have a valid photoId
      };

      const newUser: UserEntity = {
        id: '1',
        fullName: createUserDto.fullName,
        email: createUserDto.email,
        phone: createUserDto.phone,
        birthDate: createUserDto.birthDate,
        hireDate: createUserDto.hireDate,
        gender: createUserDto.gender,
        positionId: createUserDto.positionId,
        photoId: createUserDto.photoId,
        position: null, // Replace with actual PositionEntity
        photo: null, // Replace with actual PhotoEntity
      };

      jest.spyOn(usersService, 'createUser').mockResolvedValue(newUser);

      const result = await controller.createUser(createUserDto);

      expect(result).toBe(newUser);
      expect(usersService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const id = '1';
      const updateUserDto: UpdateUserDto = {
        fullName: 'Updated Name',
      };

      const updatedUser: UserEntity = {
        id: '1',
        fullName: updateUserDto.fullName,
        email: 'john.doe@example.com', // Mock additional fields as needed
        phone: '1234567890',
        birthDate: new Date('1990-01-01'),
        hireDate: new Date('2020-01-01'),
        gender: Gender.Male,
        positionId: '1', // Assuming you have a valid positionId
        photoId: 'xyz', // Assuming you have a valid photoId
        position: null,
        photo: null,
      };

      jest.spyOn(usersService, 'updateUser').mockResolvedValue(updatedUser);

      const result = await controller.updateUser(id, updateUserDto);

      expect(result).toBe(updatedUser);
      expect(usersService.updateUser).toHaveBeenCalledWith(id, updateUserDto);
    });
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      const findAllQueryDto: FindAllQueryDto = {
        q: '',
        page: 1,
        limit: 10,
      };

      const users: UserEntity[] = [
        {
          id: '1',
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          phone: '1234567890',
          birthDate: new Date('1990-01-01'),
          hireDate: new Date('2020-01-01'),
          gender: Gender.Male,
          positionId: '1', // Assuming you have a valid positionId
          photoId: 'xyz', // Assuming you have a valid photoId
          position: null,
          photo: null,
        },
        {
          id: '2',
          fullName: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '0987654321',
          birthDate: new Date('1995-05-15'),
          hireDate: new Date('2021-02-15'),
          gender: Gender.Female,
          positionId: '2', // Assuming you have a valid positionId
          photoId: 'abc', // Assuming you have a valid photoId
          position: null,
          photo: null,
        },
      ];

      jest.spyOn(usersService, 'findAll').mockResolvedValue({
        page: 1,
        limit: 10,
        total: users.length,
        pages: 1,
        results: users,
      });

      const result = await controller.findAll(findAllQueryDto);

      expect(result).toEqual({
        page: 1,
        limit: 10,
        total: users.length,
        pages: 1,
        results: users,
      });
      expect(usersService.findAll).toHaveBeenCalledWith(
        findAllQueryDto.q,
        findAllQueryDto.page,
        findAllQueryDto.limit,
      );
    });
  });

  describe('getAllUsers', () => {
    it('should get all users', async () => {
      const users: UserEntity[] = [
        {
          id: '1',
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          phone: '1234567890',
          birthDate: new Date('1990-01-01'),
          hireDate: new Date('2020-01-01'),
          gender: Gender.Male,
          positionId: '1', // Assuming you have a valid positionId
          photoId: 'xyz', // Assuming you have a valid photoId
          position: null,
          photo: null,
        },
        {
          id: '2',
          fullName: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '0987654321',
          birthDate: new Date('1995-05-15'),
          hireDate: new Date('2021-02-15'),
          gender: Gender.Female,
          positionId: '2', // Assuming you have a valid positionId
          photoId: 'abc', // Assuming you have a valid photoId
          position: null,
          photo: null,
        },
      ];

      jest.spyOn(usersService, 'getAllUsers').mockResolvedValue(users);

      const result = await controller.getAllUsers();

      expect(result).toBe(users);
      expect(usersService.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find one user by id', async () => {
      const id = '1';
      const user: UserEntity = {
        id: '1',
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        birthDate: new Date('1990-01-01'),
        hireDate: new Date('2020-01-01'),
        gender: Gender.Male,
        positionId: '1', // Assuming you have a valid positionId
        photoId: 'xyz', // Assuming you have a valid photoId
        position: null,
        photo: null,
      };

      jest.spyOn(usersService, 'findOne').mockResolvedValue(user);

      const result = await controller.findOne(id);

      expect(result).toBe(user);
      expect(usersService.findOne).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const id = '999';

      jest
        .spyOn(usersService, 'findOne')
        .mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
      expect(usersService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by id', async () => {
      const id = '1';

      jest.spyOn(usersService, 'remove').mockResolvedValue();

      await controller.deleteUser(id);

      expect(usersService.remove).toHaveBeenCalledWith(id);
    });
  });
});
