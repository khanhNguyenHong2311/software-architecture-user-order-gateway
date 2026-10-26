export interface UserProps {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  avatarUrl?: string | null;
}

export class User {
  constructor(private readonly props: UserProps) {}

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get avatarUrl(): string | null | undefined {
    return this.props.avatarUrl;
  }

  updateAvatarUrl(url: string): void {
    this.props.avatarUrl = url;
  }
}
