import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IAuthTokenRes, JWT_NAME } from '../modules/auth/auth.service';
import { IJwtToken } from '../modules/auth/JWTlocal.interface';
import { remove as cookieRm } from 'js-cookie';
import { environment as cnf } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginGuard } from '../guards/login.guard';

@Injectable({
	providedIn: 'root',
})
/** Este servicio contiene todas funciones relacionadas con los jwt, tanto para las cookies como el localStorage */
export class JwtService {
	/** Token codificado en base64 */
	private token = () => localStorage.getItem(JWT_NAME)!;

	private refresh = {
		eventOcurred: false,
	};

	constructor(private jwtHelper: JwtHelperService, private httpClient: HttpClient, private router: Router) {}

	/**
	 * Metodo que obtiene el token del localStorage y lo devuelve descodificado
	 *
	 * @returns El token de tipo `IJwtToken` descodificado
	 */
	getDecodedToken(): IJwtToken {
		return this.jwtHelper.decodeToken<IJwtToken>(this.token());
	}
	private updateJwt(token: string): void {
		localStorage.setItem(JWT_NAME, token);
		document.cookie = JWT_NAME + '=' + encodeURIComponent(token);
	}

	/**Metodo que borra el token de las cookies y del localStorage */
	rmToken(): void {
		cookieRm(JWT_NAME);
		localStorage.removeItem(JWT_NAME);
	}

	/** Debe ser llamado cuando ha ocurrido un evento que representa interación del usuario  */
	refreshEvent(): void {
		this.refresh.eventOcurred = true;
	}

	/**
	 * Manda el jwt al backend para recibir uno nuevo si: Hay token & No esta expirado
	 * & Ha ocurrido interación del usuario
	 */
	async refreshToken() {
		if (!this.token()) {
			return;
		}
		if (this.jwtHelper.getTokenExpirationDate(this.token())! < new Date()) {
			this.rmToken();
			this.router.navigate([LoginGuard.loginRoute], {
				queryParams: { returnUrl: this.router.url },
			});
			return;
		}
		if (!this.refresh.eventOcurred) {
			return;
		}
		//TODO: Refactor, posibles fallos
		const response: IAuthTokenRes = await this.httpClient
			.post<IAuthTokenRes>(cnf.apiURL + '/jwtrefresh', { tokenStr: this.token() })
			.toPromise();
		this.updateJwt(response.token);
		this.refresh.eventOcurred = false;
	}
}
