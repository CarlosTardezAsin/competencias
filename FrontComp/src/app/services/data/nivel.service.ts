import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { INivel } from 'sharedInterfaces/Entity';
import { INivelAddDTO, INivelGetDTO, INivelPutDTO } from 'sharedInterfaces/DTO';
import { LogService } from 'src/app/shared/log/log.service';

@Injectable({ providedIn: 'root' })
export class NivelService {
	constructor(private httpClient: HttpClient, private readonly logger: LogService) {}

	getAll(): Promise<INivelGetDTO[]> {
		const url = `${cnf.API_URL}/niveles/all`;
		this.logger.debug(`Obteniendo todos los niveles de ${url}`);
		return this.httpClient.get<INivelGetDTO[]>(url).toPromise();
	}

	/**
	 *
	 * @returns Un `Array` de todos los niveles, sean o no de referencia
	 * @returns `Promise` with all the niveles, whether or not they are for reference
	 *
	 */
	getOne(nivel: INivel['id'] | Pick<INivel, 'id'>): Promise<INivelGetDTO> {
		const idNivel = typeof nivel === 'number' ? nivel : nivel.id;
		const url = `${cnf.API_URL}/niveles/${idNivel}`;
		this.logger.debug(`Obteniendo el nivel con ID: ${idNivel}, mandado req a: ${url}`);
		return this.httpClient.get<INivel>(url).toPromise();
	}

	/**
	 * GET: get all the niveles for reference to the server
	 *
	 * @returns A {@link Promise} which resolves with all the reference niveles, rejected if something go wrong
	 *
	 */
	getAllRefNivs(): Promise<INivelGetDTO[]> {
		const url = `${cnf.API_URL}/niveles/reference`;
		this.logger.debug(`Obteniendo todos los niveles de referencia de: ${url}`);
		return this.httpClient.get<INivelGetDTO[]>(url).toPromise();
	}

	/**
	 *
	 * @param nivel level's id which will be deleted
	 * @returns A {@link Promise} which resolves as `true` if it has been deleted, rejected if something go wrong
	 *
	 */
	delete(nivel: INivel['id'] | Pick<INivel, 'id'>): Promise<true> {
		const idNivel = typeof nivel === 'number' ? nivel : nivel.id;
		const url = `${cnf.API_URL}/niveles/${idNivel}`;
		this.logger.debug(`Eliminando el nivel con ID: ${idNivel}, mandando req a: ${url}`);
		return this.httpClient.delete<true>(url).toPromise();
	}

	/**
	 *
	 * Add a new reference level to the database
	 * @param level The level to add
	 * @returns A {@link Promise} which resolves as `true` if, rejected if something go wrong
	 *
	 */
	add(level: INivelAddDTO): Promise<true> {
		const url = `${cnf.API_URL}/niveles`;
		this.logger.debug(`Añadiendo nivel con CÓDIGO: ${level.code}, POST req a: ${url}`, {
			requestBody: level,
		});
		return this.httpClient.post<true>(url, level).toPromise();
	}

	/**
	 *
	 * @param nivel The reference level edited, must have correct code
	 * @returns A {@link Promise} which resolves as `true` if level has been edited correctly, rejected otherwise
	 *
	 */
	edit(nivel: INivelPutDTO): Promise<true> {
		const url = `${cnf.API_URL}/niveles`;
		this.logger.debug(`Editando nivel con CÓDIGO: ${nivel.code}, PUT req a ${url}`, { requestBody: nivel });
		return this.httpClient.put<true>(url, nivel).toPromise();
	}
}
