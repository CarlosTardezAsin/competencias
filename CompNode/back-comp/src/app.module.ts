import { CompressionMiddleware } from '@nest-middlewares/compression';
import {
	MiddlewareConsumer,
	Module,
	NestModule,
	RequestMethod,
} from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from './config/config.service';
import { DatabaseModule } from './database/database.module';
import { AuthGuard } from './guards/auth/auth.guard';
import { FrontendMiddleware } from './middlewares/frontend.middleware';
import { UserModule } from './modules/users/user.module';

@Module({
	imports: [
		UserModule,
		DatabaseModule,
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'ngInves'),
			exclude: ['/nest*'],
		}),
	],
	controllers: [AppController],
	providers: [AppService, AuthGuard, ConfigService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		//Modulo que comprime las request con gzip
		CompressionMiddleware.configure({ level: 8 });
		consumer
			.apply(FrontendMiddleware, CompressionMiddleware)
			.forRoutes({ path: '**', method: RequestMethod.ALL });
	}
}
