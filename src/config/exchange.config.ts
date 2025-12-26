import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replaceAll('\\n', '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get fallbackLanguage(): string {
    return this.getString('FALLBACK_LANGUAGE');
  }

  get getWinstonDebug(): boolean {
    return this.getBoolean('DEBUG');
  }

  get getWinstonJsonLogger(): boolean {
    return this.getBoolean('USE_JSON_LOGGER');
  }

  get awsS3Config() {
    return {
      bucketRegion: this.getString('AWS_S3_BUCKET_REGION'),
      bucketApiVersion: this.getString('AWS_S3_API_VERSION'),
      bucketName: this.getString('AWS_S3_BUCKET_NAME'),
    };
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION');
  }

  get natsEnabled(): boolean {
    return this.getBoolean('NATS_ENABLED');
  }

  get nestConfig() {
    return {
      port: this.getNumber('NEST_PORT'),
    };
  }

  get nestCacheManager() {
    return {
      host: this.getString('REDIS_HOST'),
      port: this.getNumber('REDIS_PORT'),
      ttl: this.getNumber('REDIS_TTL'),
      // uri: this.getString('REDIS_URI'),
      // pass: this.getNumber('REDIS_PASS'),
    };
  }

  get getTerminusHealth() {
    return {
      memoryLimit: this.getNumber('HEALTH_MEMORY_LIMIT'),
      diskThreshold: this.getNumber('HEALTH_DISK_THRESHOLD'),
    };
  }

  get corsConfig() {
    return {
      enabled: this.getBoolean('CORS_ENABLED'),
    };
  }

  get swaggerConfig() {
    return {
      enabled: this.getBoolean('SWAGGER_ENABLED'),
      title: this.getString('SWAGGER_TITLE'),
      description: this.getString('SWAGGER_DESCRIPTION'),
      path: this.getNumber('SWAGGER_PATH'),
    };
  }

  get securityConfig() {
    return {
      expiresIn: this.getNumber('SECURITY_EXPIRE_ACCESS'),
      refreshIn: this.getNumber('SECURITY_EXPIRE_REFRESH'),
      bcryptSaltOrRound: this.getNumber('SECURITY_BCRYPTSALTORROUND'),
    };
  }

  get authConfig() {
    return {
      accessSecret: this.getString('JWT_ACCESS_SECRET'),
      refreshSecret: this.getString('JWT_REFRESH_SECRET'),
    };
  }
  get getMailerTransport() {
    return {
      host: this.getString('SMTP_HOST'), // e.g., 'smtp.example.com'
      port: this.getNumber('SMTP_PORT'), // e.g., 587
      secure: this.getBoolean('SMTP_SECURE'), // true for 465, false for other ports
      auth: {
        user: this.getString('SMTP_USER'), // e.g., 'user@example.com'
        pass: this.getString('SMTP_PASS'), // your password
      },
    };
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
    };
  }
  get stripe() {
    return {
      secret: this.getString('STRIPE_SECRET_KEY'),
      // restricted: this.getString('RESTRICTED_KEY'),
    };
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (value == null) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }
}
