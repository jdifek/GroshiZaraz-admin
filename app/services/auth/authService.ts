import $api from "../http";
import { AuthResponse, ChangePasswordPayload, LoginPayload, RegisterPayload, UserProfile } from "./authTypes";


export default class AuthService {
  static async register(params: RegisterPayload): Promise<AuthResponse> {
    try {
      const response = await $api.post<AuthResponse>("/api/auth/register", params);
      return response.data;
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      throw error;
    }
  }

  static async login(params: LoginPayload): Promise<AuthResponse> {
    try {
      const response = await $api.post<AuthResponse>("/api/auth/login", params);
      return response.data;
    } catch (error) {
      console.error("Ошибка при входе:", error);
      throw error;
    }
  }

  static async refresh(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await $api.post<AuthResponse>("/api/auth/refresh", { refreshToken });
      return response.data;
    } catch (error) {
      console.error("Ошибка при обновлении токена:", error);
      throw error;
    }
  }

  static async getProfile(): Promise<UserProfile> {
    try {
      const response = await $api.get<UserProfile>("/api/auth/profile");
      return response.data;
    } catch (error) {
      console.error("Ошибка при получении профиля:", error);
      throw error;
    }
  }

  static async changePassword(params: ChangePasswordPayload): Promise<void> {
    try {
      await $api.post("/api/auth/change-password", params);
    } catch (error) {
      console.error("Ошибка при смене пароля:", error);
      throw error;
    }
  }
}
