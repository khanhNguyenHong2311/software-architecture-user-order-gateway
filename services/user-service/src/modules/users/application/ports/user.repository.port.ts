import { User } from "../../domain/entities/user.entity";

export const USER_REPOSITORY_PORT = Symbol("USER_REPOSITORY_PORT");

export interface UserRepositoryPort {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
}
