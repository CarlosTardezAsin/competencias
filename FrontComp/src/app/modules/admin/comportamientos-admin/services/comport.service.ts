import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as cnf } from 'src/environments/environment';
import { IComportamiento } from 'sharedInterfaces/Entity';
import { IComportAddDTO, IComportGetDTO } from 'sharedInterfaces/DTO';
import { Comportamiento } from '../../../../../../../back-comp/src/entity';

@Injectable({ providedIn: 'root' })
export class ComportService {
	constructor(private httpClient: HttpClient) {}

	/**
	 * GET: get all the comportamientos to the server, used only for the ADMIN
	 *
	 * @returns `Array` with all the comportamientos
	 * TODO: DTO return type, falta DTO
	 *
	 */
	public getAll(): Promise<IComportamiento[]> {
		return this.httpClient.get<IComportamiento[]>(`${cnf.apiURL}/comportamientos/all`).toPromise();
	}

	/**
	 * DELETE: delete a comport to the server
	 *
	 * @param cComp The id from the cComp that we want to delete
	 * @throws Exception type http with the error code, if the comportamiento could not be deleted
	 * @returns A `Promise` that it's `True` if it has been deleted, `False` if it hasn't
	 * TODO: DONE, testear
	 *
	 */
	async delete(comport: Comportamiento['id'] | Pick<Comportamiento, 'id'>): Promise<boolean> {
		const id = typeof comport === 'string' ? comport : comport.id;
		let borrado = false;
		try {
			borrado = await this.httpClient.delete<boolean>(`${cnf.apiURL}/comportamientos/${id}`).toPromise();
		} catch (error) {
			console.log(error);
			alert('No se ha podido borrar ese comportamiento, contacte con un administrador.');
		}
		return borrado;
	}

	/**
	 * POST: add a new comportamiento to the server

	 *
	 * @param comp The comp we want to add
	 * @returns A `Promise` that it's `True` if it has been add, `False` if it hasn't
	 * TODO: DONE, testear
	 *
	 */
	add(comp: IComportAddDTO): Promise<boolean> {
		return this.httpClient.post<boolean>(`${cnf.apiURL}/comportamientos`, comp).toPromise();
	}

	/**
	 * PUT: edit a catComp to the server
	 *
	 * @param comport the comport to edit in the ddbb
	 * @returns A `Promise` that it's `True` if it has been edited, `False` if it hasn't
	 * TODO: DONE, testear
	 *
	 */
	edit(comport: IComportAddDTO): Promise<boolean> {
		return this.httpClient.put<boolean>(`${cnf.apiURL}/comportamientos`, comport).toPromise();
	}
}
